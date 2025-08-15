# Book Management System

A comprehensive book management system with author management and admin functionality.

## Getting Started

Follow these steps to set up and run the project:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migrations
```bash
npm run migrations
```

### 3. Build the Project
```bash
npm run build
```

### 4. Start the Application
```bash
npm run start
```

### 5. Development Mode
For development with hot reload:
```bash
npm run dev
```

## Usage Instructions

### Admin Access
The system comes with a default admin account for testing purposes:

- **Email:** `admin@gmail.com`
- **Password:** `admin123`

> **Note:** You can customize the admin credentials by updating the corresponding values in your `.env` file.

### Workflow

1. **Create Authors First:** Before adding books, you need to create authors in the system. This is done through the admin interface.

2. **Create Books:** After authors are created, you can add books to the system. Each book must be assigned to an existing author.

3. **Admin Management:** All author and book creation/management operations are performed by the admin user.

## Environment Configuration

You can customize various settings including admin credentials through your `.env` file:

```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
# Add other environment variables as needed
```

## Project Structure

- Authors must be created before books
- Books require author assignment
- Admin manages all content creation
- Default admin credentials provided for testing

## Support

For any issues or questions, please refer to the project documentation or contact the development team.
