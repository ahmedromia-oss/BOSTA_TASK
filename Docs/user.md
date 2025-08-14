# User Controller API Documentation

## Overview
The User Controller handles user management operations including user creation, retrieval, updates, and deletion with role-based access control.

## Base URL
```
/users
```

## Authentication
Some endpoints require JWT authentication and/or specific roles:
- 🔒 **JWT Required**: Endpoint requires valid JWT token in Authorization header
-  **Admin Only**: Endpoint requires ADMIN role

## Endpoints

### 1. Get All Users
**GET** `/users/`

Retrieves all users in the system.

**Authentication:** None required

**Response:** Array of `GetUserDto`
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "userType": "USER" | "ADMIN"
    }
  ]
}
```

**Status Codes:**
- `200` - Users retrieved successfully

---

### 2. Create New User
**POST** `/users/create`

Creates a new user account.

**Authentication:** None required

**Request Body:** `createUserDto`
```json
{
  "username": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response:** `GetUserDto`
```json
{
  "code": "SUCCESS",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "userType": "USER"
  }
}
```

**Status Codes:**
- `200` - User created successfully
- `400` - Bad request (validation errors)

---

### 3. Get User by ID
**GET** `/users/user/:id`

Retrieves a specific user by their ID.

**Authentication:** None required

**Path Parameters:**
- `id` (required, string): User ID

**Example Request:**
```http
GET /users/user/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `GetUserDto` or null
```json
{
  "code": "SUCCESS",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "userType": "USER" | "ADMIN"
  }
}
```

**Status Codes:**
- `200` - User found and retrieved
- `404` - User not found

---

### 4. Update Current User Profile
**PUT** `/users/update`

🔒 **JWT Required** - Updates the current authenticated user's profile.

**Authentication:** Requires valid JWT token

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** `updateUserDto`
```json
{
  "username": "string (optional)"
}
```

**Example Request:**
```http
PUT /users/update
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "newusername"
}
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "User updated successfully"
}
```

**Status Codes:**
- `200` - User updated successfully
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid or missing JWT token)

---

### 5. Delete User Account
**DELETE** `/users/delete/:id`

 **Admin Only** - Deletes a user account by ID.

**Authentication:** Requires valid JWT token with ADMIN role

**Path Parameters:**
- `id` (required, string): User ID to delete

**Headers:**
```http
Authorization: Bearer <admin_jwt_token>
```

**Example Request:**
```http
DELETE /users/delete/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** String confirmation message
```json
{
  "code": "SUCCESS",
  "data": "User deleted successfully"
}
```

**Status Codes:**
- `200` - User deleted successfully
- `401` - Unauthorized (invalid or missing JWT token)
- `403` - Forbidden (insufficient permissions - not admin)
- `404` - User not found

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

## Data Models

### createUserDto
```typescript
{
  username: string;    // Required, user display name
  email: string;       // Required, valid email format
  password: string;    // Required, user password
}
```

### updateUserDto
```typescript
{
  username?: string;   // Optional, updated username
}
```

### GetUserDto
```typescript
{
  id: string;
  username: string;
  email: string;
  userType: "USER" | "ADMIN";
}
```

## User Types

The system supports two user types:
- **USER**: Regular user with basic permissions
- **ADMIN**: Administrator with elevated permissions

## Usage Examples

### Create a New User
```javascript
const response = await fetch('/users/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john.doe@example.com',
    password: 'securepassword123'
  })
});

const result = await response.json();
console.log(result.data); // GetUserDto object
```

### Update Current User (Authenticated)
```javascript
const response = await fetch('/users/update', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'newusername'
  })
});

const result = await response.json();
console.log(result.data); // "User updated successfully"
```

### Delete User (Admin Only)
```javascript
const response = await fetch('/users/delete/123e4567-e89b-12d3-a456-426614174000', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('admin_jwt_token'),
  }
});

const result = await response.json();
console.log(result.data); // "User deleted successfully"
```

### Get All Users
```javascript
const response = await fetch('/users/');
const result = await response.json();
console.log(result.data); // Array of GetUserDto objects
```

## Notes

1. **Password Security**: Passwords are hashed before storage and never returned in API responses.

2. **Email Uniqueness**: Email addresses must be unique across the system.

3. **Self-Update Only**: Users can only update their own profile using the `/users/update` endpoint.

4. **Admin Privileges**: Only admin users can delete other user accounts.

5. **Case Sensitivity**: Email addresses are automatically converted to lowercase during processing.