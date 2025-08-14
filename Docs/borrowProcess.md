# Library Book Borrowing System Documentation

This document provides detailed information about the book borrowing functionality in the Library Management System, including the complete borrowing workflow, API endpoints, business rules, and data structures.

## Overview

The borrowing system allows authenticated users to borrow and return books from the library. The system tracks borrowing records, manages book availability, handles due dates, and monitors overdue books. Administrators have additional capabilities to view system-wide borrowing statistics and manage overdue items.

## Borrowing Workflow

### Standard User Borrowing Process

1. **Authentication**: User must be logged in with a valid JWT token
2. **Book Selection**: User identifies a book they want to borrow by its ID
3. **Availability Check**: System verifies the book is available (availableQuantity > 0)
4. **Duplicate Check**: System ensures user hasn't already borrowed the same book
5. **Borrow Request**: User sends POST request to `/borrow/:bookId`
6. **Record Creation**: System creates a borrowing record with status "BORROWED"
7. **Inventory Update**: Book's availableQuantity is decremented by 1
8. **Due Date Assignment**: System sets a due date based on library policy

### Return Process

1. **Authentication**: User must be logged in with a valid JWT token
2. **Return Request**: User sends POST request to `/return/:bookId`
3. **Record Verification**: System checks for active borrowing record
4. **Status Update**: Borrowing record status is updated to "RETURNED"
5. **Inventory Update**: Book's availableQuantity is incremented by 1
6. **Confirmation**: System provides confirmation of successful return

## API Endpoints

### Borrow Book

**POST** `/borrow/:bookId`

Allows an authenticated user to borrow a book from the library.

**Authentication**: Required (JWT token)

**Path Parameters**:
- `bookId` (string): Unique identifier of the book to borrow

**Request Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Success Response**:
```json
{
  "code": "SUCCESS",
  "data": "Book borrowed successfully"
}
```

**Error Responses**:
```json
// Book not available
{
  "code": "BAD_INPUT",
  "data": "Book is not available for borrowing"
}

// Already borrowed by user
{
  "code": "BAD_INPUT", 
  "data": "You have already borrowed this book"
}

// Book not found
{
  "code": "NOT_FOUND",
  "data": "Book not found"
}

// Authentication required
{
  "code": "UN_AUTORIZED",
  "data": "Authentication required"
}
```

**Business Rules**:
- User must be authenticated
- Book must exist in the system
- Book must have availableQuantity > 0
- User cannot borrow the same book multiple times simultaneously
- Due date is automatically set (typically 14 days from borrow date)

### Return Book

**POST** `/return/:bookId`

Allows an authenticated user to return a previously borrowed book.

**Authentication**: Required (JWT token)

**Path Parameters**:
- `bookId` (string): Unique identifier of the book to return

**Request Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Success Response**:
```json
{
  "code": "SUCCESS",
  "data": "Book returned successfully"
}
```

**Error Responses**:
```json
// No active borrowing record
{
  "code": "BAD_INPUT",
  "data": "You have not borrowed this book"
}

// Book not found
{
  "code": "NOT_FOUND",
  "data": "Book not found"
}

// Authentication required
{
  "code": "UN_AUTORIZED",
  "data": "Authentication required"
}
```

**Business Rules**:
- User must be authenticated
- User must have an active (non-returned) borrowing record for the specified book
- Book's availableQuantity is incremented upon successful return
- Borrowing record status is updated to "RETURNED"

### Get User's Borrowed Books

**GET** `/borrowed-books`

Retrieves all books currently borrowed by the authenticated user.

**Authentication**: Required (JWT token)

**Query Parameters**:
- `skip` (number, optional): Number of records to skip for pagination (default: 0)
- `take` (number, optional): Number of records to retrieve (default: 10)

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "status": "BORROWED",
      "borrowDate": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-01-29T10:30:00.000Z",
      "user": {
        "id": "user-123",
        "username": "john_doe",
        "email": "john@example.com",
        "userType": "USER"
      },
      "book": {
        "id": "book-456",
        "title": "The Great Gatsby",
        "author": {
          "id": 1,
          "name": "F. Scott Fitzgerald",
          "books": [],
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "ISBN": "978-0-7432-7356-5",
        "availableQuantity": 3,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  ]
}
```

### Get User's Overdue Books

**GET** `/overdue-books`

Retrieves all overdue books for the authenticated user.

**Authentication**: Required (JWT token)

**Query Parameters**:
- `skip` (number, optional): Number of records to skip for pagination
- `take` (number, optional): Number of records to retrieve

**Request Headers**:
```
Authorization: Bearer <jwt-token>
```

**Success Response**:
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "status": "OVERDUE",
      "borrowDate": "2024-01-01T10:00:00.000Z",
      "dueDate": "2024-01-15T10:00:00.000Z",
      "user": {
        "id": "user-123",
        "username": "john_doe",
        "email": "john@example.com",
        "userType": "USER"
      },
      "book": {
        "id": "book-789",
        "title": "To Kill a Mockingbird",
        "author": {
          "id": 2,
          "name": "Harper Lee",
          "books": [],
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "ISBN": "978-0-06-112008-4",
        "availableQuantity": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    }
  ]
}
```

## Administrative Endpoints

### Get All Borrowed Books (Admin View)

**GET** `/all-borrowed-books`

Retrieves all borrowed books across all users in the system. Administrative endpoint for monitoring system-wide borrowing activity.

**Authentication**: Required (Admin privileges)

**Query Parameters**:
- `skip` (number, optional): Number of records to skip for pagination
- `take` (number, optional): Number of records to retrieve

**Request Headers**:
```
Authorization: Bearer <admin-jwt-token>
```

**Success Response**: Array of getBorrowedBooksDto objects for all users

**Business Rules**:
- Only users with ADMIN role can access this endpoint
- Returns borrowing records from all users in the system
- Useful for generating reports and monitoring library usage

### Get All Overdue Books (Admin View)

**GET** `/all-overdue-books`

Retrieves all overdue books across all users in the system. Administrative endpoint for managing overdue items.

**Authentication**: Required (Admin privileges)

**Query Parameters**:
- `skip` (number, optional): Number of records to skip for pagination
- `take` (number, optional): Number of records to retrieve

**Request Headers**:
```
Authorization: Bearer <admin-jwt-token>
```

**Success Response**: Array of getBorrowedBooksDto objects with overdue status

**Business Rules**:
- Only users with ADMIN role can access this endpoint
- Returns only overdue borrowing records from all users
- Useful for following up on overdue books and managing library policies

## Data Structures

### getBorrowedBooksDto

The primary data structure returned by borrowing-related endpoints:

```typescript
{
  status: BorrowStatus;           // "BORROWED" | "RETURNED" | "OVERDUE"
  borrowDate: Date;               // When the book was borrowed
  dueDate: Date;                  // When the book is due for return
  user: GetUserDto;               // User information
  book: GetBookDto;               // Book information with author details
}
```

### BorrowStatus Enum

```typescript
enum BorrowStatus {
  BORROWED = "BORROWED",    // Currently borrowed and not yet due
  RETURNED = "RETURNED",    // Successfully returned
  OVERDUE = "OVERDUE"       // Past due date and not yet returned
}
```

## Business Rules and Policies

### Borrowing Limits
- Users can borrow multiple different books simultaneously
- Users cannot borrow the same book multiple times while it's still borrowed
- No system-wide limit on the number of books a user can borrow (configurable)

### Due Dates
- Standard loan period is typically 14 days from borrow date
- Due dates are automatically calculated when a book is borrowed
- System automatically marks books as overdue past the due date

### Book Availability
- Books must have availableQuantity > 0 to be borrowed
- Each successful borrow decrements the availableQuantity by 1
- Each successful return increments the availableQuantity by 1

### Overdue Management
- Books are automatically marked as overdue when past their due date
- Overdue status is calculated dynamically based on current date vs due date
- Administrative tools are provided to monitor and manage overdue books

### Return Process
- Users can return books at any time, even if overdue
- Returning a book immediately updates its status and availability
- No penalties or fees are currently implemented in the API

## Error Handling

### Common Borrowing Errors

**Book Not Available**:
- Status Code: 400
- Error Code: "BAD_INPUT"
- Occurs when availableQuantity is 0

**Duplicate Borrowing**:
- Status Code: 400  
- Error Code: "BAD_INPUT"
- Occurs when user tries to borrow a book they already have

**Book Not Found**:
- Status Code: 404
- Error Code: "NOT_FOUND"
- Occurs when bookId doesn't exist in the system

**Authentication Required**:
- Status Code: 401
- Error Code: "UN_AUTORIZED"
- Occurs when JWT token is missing or invalid

**No Borrowing Record**:
- Status Code: 400
- Error Code: "BAD_INPUT"
- Occurs when user tries to return a book they haven't borrowed

**Access Denied**:
- Status Code: 403
- Error Code: "FORBIDDEN"
- Occurs when non-admin tries to access admin endpoints

## Integration Examples

### Complete Borrowing Flow Example

```javascript
// 1. Login to get JWT token
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { data: authData } = await loginResponse.json();
const token = authData.token;

// 2. Search for available books
const booksResponse = await fetch('/book/search?search=gatsby');
const { data: books } = await booksResponse.json();
const bookId = books[0].id;

// 3. Borrow the book
const borrowResponse = await fetch(`/borrow/${bookId}`, {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// 4. Check borrowed books
const borrowedResponse = await fetch('/borrowed-books', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: borrowedBooks } = await borrowedResponse.json();

// 5. Return the book when done
const returnResponse = await fetch(`/return/${bookId}`, {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

This borrowing system provides a complete workflow for library book management with proper authentication, validation, and error handling.