# Author Controller API Documentation

## Overview
The Author Controller handles author management operations including creation, retrieval, updates, and deletion. Most write operations require admin privileges.

## Base URL
```
/author
```

## Authentication
Some endpoints require JWT authentication with specific roles:
-  **Admin Only**: Endpoint requires ADMIN role and valid JWT token

## Endpoints

### 1. Create New Author
**POST** `/author`

 **Admin Only** - Creates a new author in the system.

**Authentication:** Requires valid JWT token with ADMIN role

**Headers:**
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:** `CreateAuthorDto`
```json
{
  "name": "string (required, max 255 characters)"
}
```

**Example Request:**
```http
POST /author
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "J.K. Rowling"
}
```

**Response:** `getAuthorDto`
```json
{
  "code": "SUCCESS",
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "books": [],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Author created successfully
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid or missing JWT token)
- `403` - Forbidden (insufficient permissions - not admin)

---

### 2. Get Author by ID
**GET** `/author/:id`

Retrieves a specific author by their ID along with their books.

**Authentication:** None required

**Path Parameters:**
- `id` (required, number): Author ID

**Example Request:**
```http
GET /author/1
```

**Response:** `getAuthorDto` or null
```json
{
  "code": "SUCCESS",
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "books": [
      {
        "id": "string",
        "title": "Harry Potter and the Philosopher's Stone",
        "author": {
          "id": 1,
          "name": "J.K. Rowling",
          "books": [],
          "createdAt": "2024-01-01T00:00:00Z",
          "updatedAt": "2024-01-01T00:00:00Z"
        },
        "ISBN": "978-0747532699",
        "availableQuantity": 5,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Author found and retrieved
- `404` - Author not found

---

### 3. Get All Authors
**GET** `/author`

Retrieves all authors in the system along with their books.

**Authentication:** None required

**Response:** Array of `getAuthorDto`
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "books": [
        {
          "id": "string",
          "title": "Harry Potter and the Philosopher's Stone",
          "author": {
            "id": 1,
            "name": "J.K. Rowling",
            "books": [],
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z"
          },
          "ISBN": "978-0747532699",
          "availableQuantity": 5,
          "createdAt": "2024-01-01T00:00:00Z",
          "updatedAt": "2024-01-01T00:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Authors retrieved successfully

---

### 4. Update Author
**PUT** `/author/:id`

 **Admin Only** - Updates author information by ID.

**Authentication:** Requires valid JWT token with ADMIN role

**Path Parameters:**
- `id` (required, number): Author ID

**Headers:**
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:** `UpdateAuthorDto`
```json
{
  // Currently no updatable fields defined in UpdateAuthorDto
  // This may be extended in the future
}
```

**Example Request:**
```http
PUT /author/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  // Future update fields would go here
}
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "Author updated successfully"
}
```

**Status Codes:**
- `200` - Author updated successfully
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid or missing JWT token)
- `403` - Forbidden (insufficient permissions - not admin)
- `404` - Author not found

---

### 5. Delete Author
**DELETE** `/author/:id`

 **Admin Only** - Deletes an author by ID.

**Authentication:** Requires valid JWT token with ADMIN role

**Path Parameters:**
- `id` (required, number): Author ID

**Headers:**
```http
Authorization: Bearer <admin_jwt_token>
```

**Example Request:**
```http
DELETE /author/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "Author deleted successfully"
}
```

**Status Codes:**
- `200` - Author deleted successfully
- `401` - Unauthorized (invalid or missing JWT token)
- `403` - Forbidden (insufficient permissions - not admin)
- `404` - Author not found

---

## Error Handling

### Common Error Responses

**Bad Request (400)**
```json
{
  "code": "BAD_INPUT",
  "Errors": {
    "fieldName": "Validation error message"
  }
}
```

**Unauthorized (401)**
```json
{
  "code": "UN_AUTORIZED"
}
```

**Forbidden (403)**
```json
{
  "code": "FORBIDDEN"
}
```

**Not Found (404)**
```json
{
  "code": "NOT_FOUND"
}
```

**Database Error (400)**
```json
{
  "code": "SMTH_WITH_DB"
}
```

## Data Models

### CreateAuthorDto
```typescript
{
  name: string;    // Required, max 255 characters, author's full name
}
```

### UpdateAuthorDto
```typescript
{
  // Currently empty - may be extended with updatable fields in the future
}
```

### getAuthorDto
```typescript
{
  id: number;
  name: string;
  books: GetBookDto[];    // Array of books written by this author
  createdAt: Date;
  updatedAt: Date;
}
```

### GetBookDto (nested in author response)
```typescript
{
  id: string;
  title: string;
  author: getAuthorDto;   // Circular reference, typically simplified
  ISBN: string;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### Create an Author (Admin Only)
```javascript
const response = await fetch('/author', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('admin_jwt_token'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'George R.R. Martin'
  })
});

const result = await response.json();
console.log(result.data); // getAuthorDto object
```

### Get All Authors
```javascript
const response = await fetch('/author');
const result = await response.json();
console.log(result.data); // Array of getAuthorDto objects
```

### Get Author by ID
```javascript
const response = await fetch('/author/1');
const result = await response.json();
console.log(result.data); // getAuthorDto object with books
```

### Delete Author (Admin Only)
```javascript
const response = await fetch('/author/1', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('admin_jwt_token'),
  }
});

const result = await response.json();
console.log(result.data); // "Author deleted successfully"
```

## Notes

1. **Admin Permissions**: All write operations (CREATE, UPDATE, DELETE) require admin privileges.

2. **Author-Book Relationship**: Authors have a one-to-many relationship with books. When retrieving author data, associated books are included.

3. **Cascading Deletes**: Consider the implications of deleting an author who has associated books. The system may need to handle these relationships appropriately.

4. **Name Validation**: Author names are limited to 255 characters and cannot be empty.

5. **Update Functionality**: The UpdateAuthorDto is currently empty, indicating that author updates may not be fully implemented yet or may be extended in the future.

6. **ID Type**: Author IDs are numeric (number type) unlike book and user IDs which are strings.