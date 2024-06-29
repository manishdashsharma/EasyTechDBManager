import { connectToDbClient } from "../config/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import PayloadValidationServices from "../services/validation.services.js";
import { databaseSchema,
    userDataSchema,
    dropDatabaseSchema,
    dropCollectionSchema,
    insertDocumentSchema,
    fetchDocumentsSchema,
    updateDocumentSchema,
    deleteDocumentSchema, } from "../utils/payloadSchema.js";
import User from "../models/auth.schema.js";

const createDatabase = asyncHandler(async (req, res) => {
  const { databaseName, mongodbURI, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(
    databaseSchema,
    {
      databaseName,
      mongodbURI,
      collectionName,
    }
  );

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  let client;
  try {
    client = await connectToDbClient(mongodbURI);
    const user = req.user;

    if (user && !user.is_paid && user.dbCount >= 5) {
      return res.status(403).json({
        success: false,
        message: "Free users can create up to 5 databases only.",
      });
    }

    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    const dbExists = databases.databases.some((db) => db.name === databaseName);

    if (dbExists) {
      const db = client.db(databaseName);
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
      const db = client.db(databaseName);
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
  } finally {
    if (client) {
      await client.close();
      console.log("Connection closed.");
    }
  }
});

const createCollection = asyncHandler(async (req, res) => {
  const { databaseName, mongodbURI, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(
    databaseSchema,
    {
      databaseName,
      mongodbURI,
      collectionName,
    }
  );

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  let client;
  try {
    client = await connectToDbClient(mongodbURI);
    const user = req.user;

    if (user && !user.is_paid && user.dbCount >= 5) {
      return res.status(403).json({
        success: false,
        message: "Free users can create up to 5 databases only.",
      });
    }

    const db = client.db(databaseName);
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
  } finally {
    if (client) {
      await client.close();
      console.log("Connection closed.");
    }
  }
});

const dropCollection = asyncHandler(async (req, res) => {
  const { databaseName, mongodbURI, collectionName } = req.body;

  const validatePayload = PayloadValidationServices.validateData(
    dropCollectionSchema,
    {
      databaseName,
      mongodbURI,
      collectionName,
    }
  );

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  let client;
  try {
    client = await connectToDbClient(mongodbURI);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key.",
      });
    }

    const db = client.db(databaseName);

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
  } finally {
    if (client) {
      await client.close();
      console.log("Connection closed.");
    }
  }
});

const dropDatabase = asyncHandler(async (req, res) => {
  const { databaseName, mongodbURI } = req.body;

  const validatePayload = PayloadValidationServices.validateData(
    dropDatabaseSchema,
    {
      databaseName,
      mongodbURI,
    }
  );

  if (!validatePayload.isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
      errors: validatePayload.errors,
    });
  }

  let client;
  try {
    client = await connectToDbClient(mongodbURI);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key.",
      });
    }

    const db = client.db(databaseName);

    await db.dropDatabase();
    return res.status(200).json({
      success: true,
      message: `Database '${databaseName}' dropped successfully.`,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while dropping the database.",
      error: error.message,
    });
  } finally {
    if (client) {
      await client.close();
      console.log("Connection closed.");
    }
  }
});

const insertDocument = asyncHandler(async (req, res) => {
    const { databaseName, mongodbURI, collectionName, document } = req.body;

    const validatePayload = PayloadValidationServices.validateData(
        insertDocumentSchema,
        {
            databaseName,
            mongodbURI,
            collectionName,
            document,
        }
    );

    if (!validatePayload.isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid payload",
            errors: validatePayload.errors,
        });
    }

    let client;
    try {
        // Reuse existing connection
        client = await connectToDbClient(mongodbURI);
        const db = client.db(databaseName);

        // Check if the collection exists
        const collections = await db.listCollections({ name: collectionName }).toArray();
        const collectionExists = collections.length > 0;

        if (!collectionExists) {
            return res.status(404).json({
                success: false,
                message: `Collection '${collectionName}' does not exist in database '${databaseName}'.`,
            });
        }

        const collection = db.collection(collectionName);

        // Insert the document
        const result = await collection.insertOne(document);
        await client.close(); // Close connection after use

        return res.status(201).json({
            success: true,
            message: "Document inserted successfully",
            response: {
                success: result.acknowledged,
                insertedId: result.insertedId,
            }
        });

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});


const fetchDocuments = asyncHandler(async (req, res) => {
    const { databaseName, mongodbURI, collectionName, query = {}, limit = 10, offset = 0 } = req.body;

    const validatePayload = PayloadValidationServices.validateData(
        fetchDocumentsSchema,
        {
            databaseName,
            mongodbURI,
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

    let client;
    try {
        client = await connectToDbClient(mongodbURI);
        const db = client.db(databaseName);
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
    } finally {
        if (client) {
            await client.close();
            console.log("Connection closed.");
        }
    }
});


const updateDocument = asyncHandler(async (req, res) => {
    const { databaseName, mongodbURI, collectionName, filter, update } = req.body;

    const validatePayload = PayloadValidationServices.validateData(
        updateDocumentSchema,
        {
            databaseName,
            mongodbURI,
            collectionName,
            filter,
            update,
        })

    if (!validatePayload.isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid payload",
            errors: validatePayload.errors,
        });
    }

    let client;
    try {
        client = await connectToDbClient(mongodbURI);
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(filter, { $set: update });
        return res.status(200).json({
            success: true,
            message: "Document updated successfully",
            result
        });

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the document.",
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
            console.log("Connection closed.");
        }
    }
});

const deleteDocument = asyncHandler(async (req, res) => {
    const { databaseName, mongodbURI, collectionName, filter } = req.body;

    let client;
    try {
        client = await connectToDbClient(mongodbURI);
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne(filter);
        return res.status(200).json({
            success: true,
            message: "Document deleted successfully",
            result
        });

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the document.",
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
            console.log("Connection closed.");
        }
    }
});


export { createDatabase, createCollection, dropCollection, dropDatabase, insertDocument, fetchDocuments, updateDocument, deleteDocument  };
