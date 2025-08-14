# Book Controller API Documentation

## Overview
The Book Controller handles all book-related operations including CRUD operations, search functionality, and book management.

## Base URL
```
/book
```

## Endpoints

### 1. Create New Book
**POST** `/book`

Creates a new book in the system.

**Request Body:** `CreateBookDto`
```json
{
  "title": "string (required)",
  "ISBN": "string (required, ISBN format)",
  "authorId": "number (required)",
  "availableQuantity": "number (required, min: 0)"
}
```

**Response:** `GetBookDto`
```json
{
  "code": "SUCCESS",
  "data": {
    "id": "string",
    "title": "string",
    "author": {
      "id": "number",
      "name": "string",
      "books": [],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "ISBN": "string",
    "availableQuantity": "number",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Validations:**
- Checks for duplicate ISBN
- Checks for duplicate title
- Validates that authorId exists

**Status Codes:**
- `200` - Book created successfully
- `400` - Bad request (validation errors, duplicate ISBN/title)
- `404` - Author not found

---

### 2. Get All Books
**GET** `/book`

Retrieves all books with pagination support.

**Query Parameters:**
- `take` (optional, number): Number of records to retrieve
- `skip` (optional, number): Number of records to skip for pagination

**Example Request:**
```http
GET /book?take=10&skip=0
```

**Response:** Array of `GetBookDto`
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "id": "string",
      "title": "string",
      "author": {
        "id": "number",
        "name": "string",
        "books": [],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      "ISBN": "string",
      "availableQuantity": "number",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Books retrieved successfully

---

### 3. Get Book by ID
**GET** `/book/:id`

Retrieves a specific book by its ID.

**Path Parameters:**
- `id` (required, string): Book ID

**Example Request:**
```http
GET /book/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `GetBookDto` or null
```json
{
  "code": "SUCCESS",
  "data": {
    "id": "string",
    "title": "string",
    "author": {
      "id": "number",
      "name": "string",
      "books": [],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "ISBN": "string",
    "availableQuantity": "number",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Book found and retrieved
- `404` - Book not found

---

### 4. Update Book
**PUT** `/book/:id`

Updates book information by ID.

**Path Parameters:**
- `id` (required, string): Book ID

**Request Body:** `UpdateBookDto`
```json
{
  "availableQuantity": "number (optional, min: 0)"
}
```

**Example Request:**
```http
PUT /book/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "availableQuantity": 15
}
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "Book updated successfully"
}
```

**Status Codes:**
- `200` - Book updated successfully
- `400` - Bad request (validation errors)
- `404` - Book not found

---

### 5. Delete Book
**DELETE** `/book/:id`

Deletes a book by ID.

**Query Parameters:**
- `id` (required, string): Book ID

**Example Request:**
```http
DELETE /book/123e4567-e89b-12d3-a456-426614174000
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "Book deleted successfully"
}
```

**Status Codes:**
- `200` - Book deleted successfully
- `404` - Book not found

---

### 6. Search Books
**GET** `/book/search`

Searches for books by title, author, or other criteria.

**Query Parameters:**
- `search` (required, string): Search term

**Example Request:**
```http
GET /book/search?search=javascript
```

**Response:** Array of `GetBookDto`
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "id": "string",
      "title": "JavaScript: The Good Parts",
      "author": {
        "id": 1,
        "name": "Douglas Crockford",
        "books": [],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      "ISBN": "978-0596517748",
      "availableQuantity": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Search completed successfully

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

### CreateBookDto
```typescript
{
  title: string;          // Required, book title
  ISBN: string;           // Required, ISBN format validation
  authorId: number;       // Required, must reference existing author
  availableQuantity: number; // Required, minimum value: 0
}
```

### UpdateBookDto
```typescript
{
  availableQuantity?: number; // Optional, minimum value: 0
}
```

### GetBookDto
```typescript
{
  id: string;
  title: string;
  author: {
    id: number;
    name: string;
    books: GetBookDto[];
    createdAt: Date;
    updatedAt: Date;
  };
  ISBN: string;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### Create a Book
```javascript
const response = await fetch('/book', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Clean Code',
    ISBN: '978-0132350884',
    authorId: 1,
    availableQuantity: 10
  })
});

const result = await response.json();
console.log(result.data); // GetBookDto object
```

### Search Books
```javascript
const response = await fetch('/book/search?search=javascript');
const result = await response.json();
console.log(result.data); // Array of GetBookDto objects
```

### Update Book Quantity
```javascript
const response = await fetch('/book/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    availableQuantity: 25
  })
});

const result = await response.json();
console.log(result.data); // "Book updated successfully"
```