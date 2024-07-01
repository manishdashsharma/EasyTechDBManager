
import { connectToDbClient } from "../config/db.config.js";

const dbConnectionMiddleware = async (req, res, next) => {
  const { mongodbURI } = req.body;
  if (!mongodbURI) {
    return res.status(400).json({
      success: false,
      message: "MongoDB URI is required.",
    });
  }

  try {
    req.dbClient = await connectToDbClient(mongodbURI);
    req.db = req.dbClient.db();
    next();
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to the database.",
      error: error.message,
    });
  }
};

const closeDbConnectionMiddleware = async (req, res, next) => {
  if (req.dbClient) {
    await req.dbClient.close();
    console.log("Connection closed.");
  }
  next();
};

export { dbConnectionMiddleware, closeDbConnectionMiddleware };
