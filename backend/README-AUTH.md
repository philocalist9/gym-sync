# GymSync API Authentication & Authorization

This document outlines the role-based authentication and authorization system implemented in the GymSync backend.

## Overview

The system utilizes JSON Web Tokens (JWT) for authentication and a role-based access control system for authorization. Each API endpoint is protected to ensure only authenticated users with the appropriate role can access it.

## Middleware Functions

### `verifyToken`

This middleware verifies that a valid JWT token is provided in the request header.

- Extracts the token from the `Authorization` header (Bearer token format)
- Verifies the token against the JWT secret
- Attaches the decoded user information to the request object
- Logs access for audit purposes

### `permitRoles(...allowedRoles)`

This middleware checks if the authenticated user has one of the allowed roles.

- Takes any number of allowed roles as arguments
- Returns a middleware function that checks if the user's role is included in the allowed roles
- Must be used after `verifyToken` middleware

### `verifyApproved`

This middleware is used specifically for gym owners to ensure they've been approved by a super admin.

- Checks if the authenticated user is a gym owner
- If so, verifies their approval status
- Prevents unapproved gym owners from using features

### `verifyOwnership(modelType)`

This middleware verifies that the user is accessing their own resources or resources they have permission to access.

- Takes a model type parameter to determine ownership rules
- Handles different rules for members, trainers, and gym owners
- Allows super admins to access any resource

## Usage Examples

```javascript
// Member-only endpoint
router.get('/plans', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    // Only members can access this endpoint
    // User ID is available via req.user.userId
  }
);

// Trainer-only endpoint
router.post('/assign-plan/:clientId', 
  verifyToken, 
  permitRoles('trainer'),
  async (req, res) => {
    // Only trainers can access this endpoint
  }
);

// Gym owner endpoint with approval check
router.post('/create-user', 
  verifyToken, 
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    // Only approved gym owners can access this endpoint
  }
);

// Super admin-only endpoint
router.get('/gym-owners', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    // Only super admins can access this endpoint
  }
);
```

## Access Structure

| Role | Access Level |
|------|--------------|
| `member` | Can access only their own resources |
| `trainer` | Can access their profile and assigned members |
| `gym-owner` | Can access their gym profile and all members/trainers of their gym |
| `super-admin` | Has access to all resources in the system |

## JWT Token Structure

```javascript
// Token payload
{
  "userId": "user_id_here",
  "role": "one_of_member_trainer_gym-owner_super-admin",
  "name": "User Name",
  "email": "user@example.com",
  "gymId": "gym_id_here"  // For gym owners, trainers, and members
}
```

## Security Considerations

1. **Token validation** - All tokens are validated on every request
2. **Role checking** - Endpoints check for appropriate role before processing
3. **Resource ownership** - Users can only access resources they own or have permission to access
4. **Approval status** - Gym owners must be approved before accessing certain features
5. **Audit logging** - All API requests are logged with user role and endpoint information

## Error Handling

The middleware provides consistent error responses:

- 401 Unauthorized - Invalid or missing token
- 403 Forbidden - Valid token but insufficient permissions
- 404 Not Found - Resource not found or not accessible to the user
- 500 Server Error - Internal server errors 