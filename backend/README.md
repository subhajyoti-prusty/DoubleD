# Volunteer Management System Backend

A robust backend API for managing volunteers in disaster response scenarios.

## Features

- Volunteer registration and management
- Real-time availability updates
- Task assignment and tracking
- Rating and experience tracking
- Secure authentication
- Rate limiting and request validation
- Comprehensive logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Volunteer Endpoints

#### Register Volunteer
- **POST** `/api/volunteers`
- **Access**: Private
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "skills": ["string"],
    "experienceLevel": "beginner|intermediate|expert"
  }
  ```

#### Get All Volunteers
- **GET** `/api/volunteers`
- **Access**: Public
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

#### Get Single Volunteer
- **GET** `/api/volunteers/:id`
- **Access**: Private

#### Update Volunteer
- **PUT** `/api/volunteers/:id`
- **Access**: Private
- **Body**: Same as registration

#### Delete Volunteer
- **DELETE** `/api/volunteers/:id`
- **Access**: Private

#### Update Availability
- **PATCH** `/api/volunteers/:id/availability`
- **Access**: Private
- **Body**:
  ```json
  {
    "availability": boolean
  }
  ```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

### Project Structure

```
backend/
├── src/
│   ├── config/     # Database and configuration
│   ├── controllers/# Business logic
│   ├── middleware/ # Custom middleware
│   ├── models/     # Database schemas
│   └── routes/     # API endpoints
├── logs/           # Application logs
└── .env            # Environment variables
```

## Security Features

- JWT Authentication
- Input Validation
- Rate Limiting
- CORS Protection
- Secure Headers
- Request Logging

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Logging

Logs are stored in the `logs` directory:
- `error.log`: Error-level logs
- `combined.log`: All logs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 