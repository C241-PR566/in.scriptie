# API Documentation

## BASE URL
base URL : https://inscriptie-dot-capstone-project-c241-pr566.et.r.appspot.com

## Authentication

Authentication using JSON Web Tokens (JWT)

## Endpoints

### User Registration

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Register a new user.

### User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticate user and return JWT token.

### Translation

- **Endpoint:** `/translations`
- **Method:** `POST`
- **Description:** Upload an image to be translated and save the result.

### History

- **Endpoint:** `/translations/histories`
- **Method:** `POST`
- **Description:** Get translation histories for the authenticated user.
