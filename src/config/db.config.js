import mongoose from "mongoose";
import { MongoClient } from "mongodb";

export const connectToDb = async (URI) => {
    try {
        await mongoose.connect(URI);
        console.log('Connected to DB')
    } catch (error) {
        console.log('Failed to connect to DB: ', error);
    }
}

export const connectToDbClient = async (URI) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        return client;
        console.log("Connected successfully to server");
    } catch (error) {
        console.log('Failed to connect to DB: ', error);
    }
}