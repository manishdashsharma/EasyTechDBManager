# STATUS : DEVELOPING

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

#### 2. Insert Data
```http
POST /api/v1/db/insert-data
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "data": { "key": "value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Data inserted successfully."
}
```

#### 3. Fetch Data
```http
GET /api/v1/db/fetch-data
```
**Request Params:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "query": { "key": "value" }
}
```
**Response:**
```json
{
  "success": true,
  "data": [ ... ]
}
```

#### 4. Update Data
```http
PUT /api/v1/db/update-data
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "query": { "key": "value" },
  "update": { "key": "new_value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Data updated successfully."
}
```

#### 5. Delete Data
```http
DELETE /api/v1/db/delete-data
```
**Request Body:**
```json
{
  "databaseName": "your_database_name",
  "collectionName": "your_collection_name",
  "query": { "key": "value" }
}
```
**Response:**
```json
{
  "success": true,
  "message": "Data deleted successfully."
}
```

#### 6. Drop Collection
```http
DELETE /api/v1/db/drop-collection
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

#### 7. Drop Database
```http
DELETE /api/v1/db/drop-database
```
**Request Body:**
```json
{
  "databaseName": "your_database_name"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Database dropped successfully."
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
For support and inquiries, contact us at support@easytechinnovate.com.

---

**EasyTechDBManager** - Simplifying MongoDB database management for developers and businesses.

