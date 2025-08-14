# Library Management System API Documentation

This document provides comprehensive information about the Library Management System API endpoints, including request/response formats, authentication requirements, and usage examples.

## Authentication

The API uses JWT (JSON Web Token) authentication for protected endpoints. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **USER**: Standard user with basic privileges
- **ADMIN**: Administrator with elevated privileges

## Response Format

All API responses follow a standardized format:

```json
{
  "code": "SUCCESS" | "ERROR_CODE",
  "data": <response_data>,
  "Errors": <error_object> // Only present on validation errors
}
```

## Book Management

### Create Book
**POST** `/book`

Creates a new book in the system.

**Authentication Required**: Yes (Admin only)

**Request Body**: CreateBookDto
```json
{
  "title": "string",
  "ISBN": "string",
  "authorId": "string"
}
```

**Response**: GetBookDto
```json
{
  "id": "string",
  "title": "string",
  "author": {
    "id": "number",
    "name": "string",
    "books": [],
    "createdAt": "date",
    "updatedAt": "date"
  },
  "ISBN": "string",
  "availableQuantity": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Validation**:
- Checks for duplicate ISBN and title
- Validates that authorId exists in the system
- All fields are required

### Get All Books
**GET** `/book`

Retrieves all books with pagination support.

**Authentication Required**: No

**Query Parameters**:
- `take` (optional): Number of records to retrieve
- `skip` (optional): Number of records to skip for pagination

**Response**: Array of GetBookDto objects

### Get Book by ID
**GET** `/book/:id`

Retrieves a specific book by its ID.

**Authentication Required**: No

**Path Parameters**:
- `id`: Book identifier

**Response**: GetBookDto object or null if not found

### Search Books
**GET** `/book/search`

Searches books by title, author, or other criteria.

**Authentication Required**: No

**Query Parameters**:
- `search`: Search term to match against book properties

**Response**: Array of GetBookDto objects matching the search criteria

### Update Book
**PUT** `/book/:id`

Updates book information.

**Authentication Required**: Yes (Admin only)

**Path Parameters**:
- `id`: Book identifier

**Request Body**: UpdateBookDto
```json
{
  "availableQuantity": "number" // Optional, minimum value: 0
}
```

**Response**: String confirmation message

### Delete Book
**DELETE** `/book/:id`

Removes a book from the system.

**Authentication Required**: Yes (Admin only)

**Query Parameters**:
- `id`: Book identifier

**Response**: String confirmation message

## User Management

### Get All Users
**GET** `/users/`

Retrieves all registered users.

**Authentication Required**: Yes (Admin only)

**Response**: Array of GetUserDto objects
```json
[
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "userType": "USER" | "ADMIN"
  }
]
```

### Create User
**POST** `/users/create`

Creates a new user account.

**Authentication Required**: No

**Request Body**: createUserDto
```json
{
  "username": "string", // Required
  "email": "string",    // Required
  "password": "string"  // Required
}
```

**Response**: GetUserDto object

### Get User by ID
**GET** `/users/user/:id`

Retrieves a specific user by their ID.

**Authentication Required**: Yes

**Path Parameters**:
- `id`: User identifier

**Response**: GetUserDto object or null if not found

### Update User Profile
**PUT** `/users/update`

Updates the current authenticated user's profile.

**Authentication Required**: Yes (JWT token required)

**Request Body**: updateUserDto
```json
{
  "username": "string" // Optional
}
```

**Response**: String confirmation message

### Delete User
**DELETE** `/users/delete/:id`

Deletes a user account from the system.

**Authentication Required**: Yes (Admin only)

**Path Parameters**:
- `id`: User identifier

**Response**: String confirmation message

## Author Management

### Create Author
**POST** `/author`

Creates a new author in the system.

**Authentication Required**: Yes (Admin only)

**Request Body**: CreateAuthorDto
```json
{
  "name": "string" // Required, max length: 255 characters
}
```

**Response**: getAuthorDto object
```json
{
  "id": "number",
  "books": [],
  "name": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Get Author by ID
**GET** `/author/:id`

Retrieves a specific author by their ID.

**Authentication Required**: No

**Path Parameters**:
- `id`: Author identifier

**Response**: getAuthorDto object or null if not found

### Get All Authors
**GET** `/author`

Retrieves all authors in the system.

**Authentication Required**: No

**Response**: Array of getAuthorDto objects

### Update Author
**PUT** `/author/:id`

Updates author information.

**Authentication Required**: Yes (Admin only)

**Path Parameters**:
- `id`: Author identifier

**Request Body**: UpdateAuthorDto
```json
{
  // Currently no updatable fields defined
}
```

**Response**: String confirmation message

### Delete Author
**DELETE** `/author/:id`

Removes an author from the system.

**Authentication Required**: Yes (Admin only)

**Path Parameters**:
- `id`: Author identifier

**Response**: String confirmation message

## Book Borrowing System

### Borrow Book
**POST** `/borrow/:bookId`

Allows an authenticated user to borrow a book.

**Authentication Required**: Yes (JWT token required)

**Path Parameters**:
- `bookId`: Book identifier

**Response**: String confirmation message

**Business Rules**:
- Book must be available (availableQuantity > 0)
- User cannot borrow the same book multiple times simultaneously
- Due date is typically set based on system configuration

### Return Book
**POST** `/return/:bookId`

Allows an authenticated user to return a borrowed book.

**Authentication Required**: Yes (JWT token required)

**Path Parameters**:
- `bookId`: Book identifier

**Response**: String confirmation message

**Business Rules**:
- User must have an active borrowing record for the specified book
- Book's available quantity is incremented upon return

### Get User's Borrowed Books
**GET** `/borrowed-books`

Retrieves the current user's borrowed books.

**Authentication Required**: Yes (JWT token required)

**Query Parameters**:
- `skip` (optional): Number of records to skip for pagination
- `take` (optional): Number of records to retrieve

**Response**: Array of getBorrowedBooksDto objects
```json
[
  {
    "status": "BORROWED" | "RETURNED" | "OVERDUE",
    "borrowDate": "date",
    "dueDate": "date",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "userType": "USER" | "ADMIN"
    },
    "book": {
      "id": "string",
      "title": "string",
      "author": {...},
      "ISBN": "string",
      "availableQuantity": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
]
```

### Get User's Overdue Books
**GET** `/overdue-books`

Retrieves the current user's overdue books.

**Authentication Required**: Yes (JWT token required)

**Query Parameters**:
- `skip` (optional): Number of records to skip for pagination
- `take` (optional): Number of records to retrieve

**Response**: Array of getBorrowedBooksDto objects with overdue status

### Get All Borrowed Books (Admin)
**GET** `/all-borrowed-books`

Retrieves all borrowed books across all users. Administrative view.

**Authentication Required**: Yes (Admin only)

**Query Parameters**:
- `skip` (optional): Number of records to skip for pagination
- `take` (optional): Number of records to retrieve

**Response**: Array of getBorrowedBooksDto objects

### Get All Overdue Books (Admin)
**GET** `/all-overdue-books`

Retrieves all overdue books across all users. Administrative view.

**Authentication Required**: Yes (Admin only)

**Query Parameters**:
- `skip` (optional): Number of records to skip for pagination
- `take` (optional): Number of records to retrieve

**Response**: Array of getBorrowedBooksDto objects with overdue status

## Authentication

### User Login
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Authentication Required**: No

**Request Body**: LoginDto
```json
{
  "email": "string",    // Required, automatically converted to lowercase
  "password": "string"  // Required
}
```

**Response**: AuthResponseDto with JWT token
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "userType": "USER" | "ADMIN"
  }
}
```

**Validation**:
- Email and password are required fields
- Email is automatically converted to lowercase
- Returns appropriate error codes for invalid credentials

## Error Handling

The API implements comprehensive error handling with standardized error codes:

### Common Error Codes
- `SUCCESS`: Operation completed successfully
- `BAD_INPUT`: Validation failed or invalid input data
- `NOT_FOUND`: Requested resource does not exist
- `FORBIDDEN`: Access denied due to insufficient permissions
- `UN_AUTORIZED`: Authentication required or invalid token
- `SMTH_WITH_DB`: Database operation failed

### Validation Errors
When validation fails, the response includes detailed field-level errors:

```json
{
  "code": "BAD_INPUT",
  "Errors": {
    "fieldName": "Error message for this field",
    "anotherField": "Error message for another field"
  }
}
```

## Data Transfer Objects (DTOs)

The API uses DTOs for data serialization and validation. Key DTOs include:

- **GetBookDto**: Serialized book data for responses
- **GetUserDto**: Serialized user data for responses
- **getAuthorDto**: Serialized author data for responses
- **getBorrowedBooksDto**: Serialized borrowing record data
- **CreateBookDto**: Input validation for book creation
- **createUserDto**: Input validation for user creation
- **CreateAuthorDto**: Input validation for author creation
- **LoginDto**: Input validation for authentication

All DTOs use class-transformer decorators for proper serialization and class-validator decorators for input validation.