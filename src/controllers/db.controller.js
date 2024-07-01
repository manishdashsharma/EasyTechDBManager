import { asyncHandler } from "../utils/asyncHandler.js";
import PayloadValidationServices from "../services/validation.services.js";
import {
  databaseSchema,
  dropCollectionSchema,
  insertDocumentSchema,
  fetchDocumentsSchema,
  updateDocumentSchema,
  deleteDocumentSchema,
} from "../utils/payloadSchema.js";
import User from "../models/auth.schema.js";

const createDatabase = asyncHandler(async (req, res) => {
  const { databaseName, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(databaseSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const user = req.user;
    if (user && !user.is_paid && user.dbCount >= 5) {
      return res.status(403).json({
        success: false,
        message: "Free users can create up to 5 databases only.",
      });
    }

    const adminDb = req.db.admin();
    const databases = await adminDb.listDatabases();
    const dbExists = databases.databases.some((db) => db.name === databaseName);

    if (dbExists) {
      const db = req.dbClient.db(databaseName);
      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(
        (collection) => collection.name === collectionName
      );

      if (collectionExists) {
        const collection = db.collection(collectionName);
        const documentCount = await collection.countDocuments();

        if (documentCount === 0) {
          await collection.insertOne({
            created_at: new Date(),
            collection_name: collectionName,
          });

          if (user && !user.is_paid) {
            await User.updateOne({ _id: user._id }, { $inc: { dbCount: 1 } });
          }
          return res.status(200).json({
            success: true,
            message: `Collection '${collectionName}' in database '${databaseName}' was empty and now has initial data.`,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: `Database '${databaseName}' and collection '${collectionName}' are already present with data.`,
          });
        }
      } else {
        await db.createCollection(collectionName);
        const collection = db.collection(collectionName);
        await collection.insertOne({
          created_at: new Date(),
          collection_name: collectionName,
        });

        if (user && !user.is_paid) {
          await User.updateOne({ _id: user._id }, { $inc: { dbCount: 1 } });
        }
        return res.status(200).json({
          success: true,
          message: `Collection '${collectionName}' created in database '${databaseName}' with initial data.`,
        });
      }
    } else {
      const db = req.dbClient.db(databaseName);
      await db.createCollection(collectionName);
      const collection = db.collection(collectionName);
      await collection.insertOne({
        created_at: new Date(),
        collection_name: collectionName,
      });

      if (user && !user.is_paid) {
        await User.updateOne({ _id: user._id }, { $inc: { dbCount: 1 } });
      }
      return res.status(200).json({
        success: true,
        message: `Database '${databaseName}' and collection '${collectionName}' created with initial data.`,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the database or collection.",
      error: error.message,
    });
  }
});

const createCollection = asyncHandler(async (req, res) => {
  const { databaseName, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(databaseSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const user = req.user;
    if (user && !user.is_paid && user.dbCount >= 5) {
      return res.status(403).json({
        success: false,
        message: "Free users can create up to 5 databases only.",
      });
    }

    const db = req.dbClient.db(databaseName);
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(
      (collection) => collection.name === collectionName
    );

    if (collectionExists) {
      return res.status(400).json({
        success: false,
        message: `Collection '${collectionName}' already exists in database '${databaseName}'.`,
      });
    }

    await db.createCollection(collectionName);
    if (user && !user.is_paid) {
      await User.updateOne({ _id: user._id }, { $inc: { dbCount: 1 } });
    }

    return res.status(201).json({
      success: true,
      message: `Collection '${collectionName}' created in database '${databaseName}'.`,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the collection.",
      error: error.message,
    });
  }
});

const dropCollection = asyncHandler(async (req, res) => {
  const { databaseName, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(dropCollectionSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key.",
      });
    }

    const db = req.dbClient.db(databaseName);

    await db.dropCollection(collectionName);
    return res.status(200).json({
      success: true,
      message: `Collection '${collectionName}' dropped successfully.`,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while dropping the collection.",
      error: error.message,
    });
  }
});

const insertDocument = asyncHandler(async (req, res) => {
  const { databaseName, collectionName, document } = req.body;

  const validatePayload = PayloadValidationServices.validateData(insertDocumentSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
    document,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const db = req.dbClient.db(databaseName);

    const collections = await db.listCollections({ name: collectionName }).toArray();
    const collectionExists = collections.length > 0;

    if (!collectionExists) {
      return res.status(404).json({
        success: false,
        message: `Collection '${collectionName}' does not exist in database '${databaseName}'.`,
      });
    }

    const collection = db.collection(collectionName);

    if (document._id) {
      document._id = new ObjectId(document._id);
    }

    const result = await collection.insertOne(document);

    return res.status(201).json({
      success: true,
      message: "Document inserted successfully",
      response: {
        success: result.acknowledged,
        insertedId: result.insertedId,
      },
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while inserting the document.",
      error: error.message,
    });
  }
});

const fetchDocuments = asyncHandler(async (req, res) => {
  const { databaseName, collectionName, query = {}, limit = 10, offset = 0 } = req.body;

  const validatePayload = PayloadValidationServices.validateData(fetchDocumentsSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
    query,
    limit,
    offset,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const db = req.dbClient.db(databaseName);
    const collection = db.collection(collectionName);

    const documents = await collection.find(query).skip(offset).limit(limit).toArray();

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the documents.",
      error: error.message,
    });
  }
});

const updateDocument = asyncHandler(async (req, res) => {
  const { databaseName, collectionName, query, update } = req.body;

  const validatePayload = PayloadValidationServices.validateData(updateDocumentSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
    query,
    update,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const db = req.dbClient.db(databaseName);
    const collection = db.collection(collectionName);

    const result = await collection.updateMany(query, { $set: update });

    return res.status(200).json({
      success: true,
      message: `${result.matchedCount} document(s) matched, ${result.modifiedCount} document(s) updated`,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the documents.",
      error: error.message,
    });
  }
});

const deleteDocument = asyncHandler(async (req, res) => {
  const { databaseName, collectionName, query } = req.body;

  const validatePayload = PayloadValidationServices.validateData(deleteDocumentSchema, {
    databaseName,
    mongodbURI: req.body.mongodbURI,
    collectionName,
    query,
  });

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  try {
    const db = req.dbClient.db(databaseName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteMany(query);

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} document(s) deleted`,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the documents.",
      error: error.message,
    });
  }
});

export {
  createDatabase,
  createCollection,
  dropCollection,
  insertDocument,
  fetchDocuments,
  updateDocument,
  deleteDocument,
};
