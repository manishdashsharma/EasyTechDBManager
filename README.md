# STATUS : DEVELOPING ... v1.1.0

# EasyTechDBManager

## Introduction
EasyTechDBManager is a comprehensive database management service tailored to streamline MongoDB database and collection operations. Whether you're managing small-scale projects or large-scale applications, EasyTechDBManager simplifies the creation, management, and maintenance of MongoDB databases and collections.

## Features
- **Database Creation**: Quickly create MongoDB databases.
- **Collection Management**: Efficiently manage collections within databases.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on your data.
- **Resource Monitoring**: Monitor and manage database resources effectively.
- **API Key Authentication**: Secure API access using API keys.

## Usage
### API Endpoints

#### 1. Create Database and Collection
```http
POST /api/v1/db/create-database
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "mongodbURI": "your_mongodb_uri",
  "collectionName": "your_collection_name"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Database and collection created successfully."
}
```

#### 2. Insert Document
```http
POST /api/v1/db/insert-document
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "document": { "key": "value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document inserted successfully.",
  "response": {
    "success": true,
    "insertedId": "the_inserted_document_id"
  }
}
```

#### 3. Fetch Documents
```http
POST /api/v1/db/fetch-documents
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "query": { "key": "value" },
  "limit": 10,
  "offset": 0
}
```
**Response:**
```json
{
  "success": true,
  "documents": [ ... ]
}
```

#### 4. Update Document
```http
POST /api/v1/db/update-document
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "filter": { "key": "value" },
  "update": { "key": "new_value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document updated successfully."
}
```

#### 5. Delete Document
```http
POST /api/v1/db/delete-document
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "filter": { "key": "value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully."
}
```

#### 6. Drop Collection
```http
POST /api/v1/db/drop-collection
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Collection dropped successfully."
}
```

## Authentication
To access the API endpoints, include your API key in the request header:
```http
Authorization: Bearer your_api_key
```

## Contributing
We welcome contributions from the community! If you'd like to contribute, follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push your branch.
4. Create a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License.

## Contact
For support and inquiries, contact us at mdashsharma95@gmail.com.

---

**EasyTechDBManager** - Simplifying MongoDB database management for developers and businesses.