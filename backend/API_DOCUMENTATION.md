# User Management System - API Documentation

## Authentication Endpoints

### 1. Register

- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "role": "user"
      }
    }
  }
  ```

### 2. Login (Email or Username)

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Access:** Public
- **Body (Option 1 - Email):**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Body (Option 2 - Username):**
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "role": "user"
      }
    }
  }
  ```

### 3. Refresh Access Token

- **Method:** `POST`
- **URL:** `/api/auth/refresh-token`
- **Access:** Public
- **Body:**
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "new_jwt_token"
    }
  }
  ```

### 4. Logout

- **Method:** `POST`
- **URL:** `/api/auth/logout`
- **Access:** Private (Requires Authentication)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## Profile Endpoints (User)

### 1. Get Own Profile

- **Method:** `GET`
- **URL:** `/api/profile`
- **Access:** Private (All Authenticated Users)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2026-04-15T10:30:00Z",
      "createdAt": "2026-04-14T08:20:00Z"
    }
  }
  ```

### 2. Update Own Profile

- **Method:** `PUT`
- **URL:** `/api/profile`
- **Access:** Private (All Authenticated Users)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "username": "janedoe"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "Jane Doe",
      "username": "janedoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### 3. Change Password

- **Method:** `PUT`
- **URL:** `/api/profile/change-password`
- **Access:** Private (All Authenticated Users)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newPassword456",
    "confirmPassword": "newPassword456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

---

## Manager Endpoints

### 1. Get All Users (Excluding Admin)

- **Method:** `GET`
- **URL:** `/api/manager/users?search=john&role=user&isActive=true&sortBy=createdAt&order=desc`
- **Access:** Private (Manager & Admin)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Query Parameters:**
  - `search` (optional): Search by name, email, or username
  - `role` (optional): Filter by role (user, manager)
  - `isActive` (optional): Filter by status (true/false)
  - `sortBy` (optional): Sort field name
  - `order` (optional): Sort order (asc/desc)
- **Response:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-04-14T08:20:00Z"
      }
    ]
  }
  ```

### 2. Get Single User (Non-Admin)

- **Method:** `GET`
- **URL:** `/api/manager/users/:id`
- **Access:** Private (Manager & Admin)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```

### 3. Update User (Non-Admin)

- **Method:** `PUT`
- **URL:** `/api/manager/users/:id`
- **Access:** Private (Manager & Admin)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "manager",
    "isActive": true
  }
  ```
- **Note:** Managers cannot update admin users or promote users to admin role

---

## Admin Endpoints

### 1. Get All Users (with Search & Filter)

- **Method:** `GET`
- **URL:** `/api/admin/users?search=john&role=user&isActive=true&sortBy=createdAt&order=asc`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Query Parameters:**
  - `search` (optional): Search by name, email, or username
  - `role` (optional): Filter by role (user, manager, admin)
  - `isActive` (optional): Filter by status (true/false)
  - `sortBy` (optional): Sort field name
  - `order` (optional): Sort order (asc/desc)

### 2. Get Single User

- **Method:** `GET`
- **URL:** `/api/admin/users/:id`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```

### 3. Create User

- **Method:** `POST`
- **URL:** `/api/admin/users`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "name": "New User",
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "user"
  }
  ```

### 4. Update User

- **Method:** `PUT`
- **URL:** `/api/admin/users/:id`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "manager",
    "isActive": false
  }
  ```

### 5. Change User Role

- **Method:** `PUT`
- **URL:** `/api/admin/users/:id/role`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Body:**
  ```json
  {
    "role": "manager"
  }
  ```
- **Valid Roles:** `user`, `manager`, `admin`

### 6. Activate/Deactivate User

- **Method:** `PUT`
- **URL:** `/api/admin/users/:id/toggle-status`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User activated successfully",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true
    }
  }
  ```

### 7. Delete User

- **Method:** `DELETE`
- **URL:** `/api/admin/users/:id`
- **Access:** Private (Admin Only)
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User deleted successfully",
    "data": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

## Role Permissions Summary

| Feature             | User | Manager           | Admin |
| ------------------- | ---- | ----------------- | ----- |
| View own profile    | ✔    | ✔                 | ✔     |
| Edit own profile    | ✔    | ✔                 | ✔     |
| Change password     | ✔    | ✔                 | ✔     |
| View all users      | ❌   | ✔ (exclude admin) | ✔     |
| Search users        | ❌   | ✔ (exclude admin) | ✔     |
| Filter users        | ❌   | ✔ (exclude admin) | ✔     |
| Create users        | ❌   | ❌                | ✔     |
| Update users        | ❌   | ✔ (exclude admin) | ✔     |
| Delete users        | ❌   | ❌                | ✔     |
| Change roles        | ❌   | ❌                | ✔     |
| Activate/Deactivate | ❌   | ❌                | ✔     |

---

## Test Users

After running `npm run seed`, the following test users are available:

| Role    | Username | Email               | Password   |
| ------- | -------- | ------------------- | ---------- |
| Admin   | admin    | admin@example.com   | admin123   |
| Manager | manager  | manager@example.com | manager123 |
| User    | user     | user@example.com    | user123    |

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid input or validation error
- **401**: Unauthorized - Missing or invalid authentication token
- **403**: Forbidden - User doesn't have permission to access resource
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error
