# Email Marketing Application

A full-stack email marketing application that allows users to create and manage email sequences, schedule automated emails, and track their effectiveness using an intuitive flowchart-based interface with ReactFlow.

## Features

- User authentication and authorization
- Email sequence creation and management using ReactFlow
- Visual flowchart builder for email sequences
- Automated email scheduling based on workflow
- Email template management
- Lead source tracking
- RESTful API architecture
- Responsive design with animations

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Agenda (for job scheduling)
- Nodemailer (for email sending)

### Frontend

- React
- ReactFlow (for flowchart creation)
- Tailwind CSS
- Framer Motion (for animations)
- Vite

## How It Works

The application allows users to create visual email sequences using a drag-and-drop interface:

1. **Node Types:**

   - **Lead Source:** Define where your leads come from (e.g., Website, LinkedIn)
   - **Cold Email:** Create email content with subject and message
   - **Wait/Delay:** Add time delays between emails (minutes, hours, days, weeks)

2. **Flow Creation:**

   - Drag nodes onto the canvas
   - Connect nodes to establish the sequence flow
   - Configure each node with specific settings

3. **Scheduling:**
   - Save your flow to store it in the database
   - Provide recipient email(s) to schedule the sequence
   - The system automatically schedules emails based on the defined delays

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd email-marketing
```

2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/email-marketing
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
JWT_SECRET=your-secret-key
```

4. Start the development servers

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
cd ..
npm run dev
```

## Using the Sequence Builder

1. **Access the Builder:**

   - Log in to your account
   - Navigate to "Sequence Builder" in the sidebar

2. **Create a Sequence:**

   - Select a node type from the right panel
   - Fill in required details (subject, message, delay duration, etc.)
   - Click "Add Node" to add it to the canvas
   - Repeat for additional nodes

3. **Connect Nodes:**

   - Click and drag from one node's handle to another
   - Create a logical flow for your email sequence

4. **Save and Schedule:**
   - Click "Save Sequence" when finished
   - Enter recipient email to schedule the sequence
   - The system will automatically schedule emails based on the defined flow

## Testing

Run the test suite:

```bash
cd backend
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST /api/auth/login

Login user

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Email Sequence Endpoints

#### POST /api/sequences

Create a new email sequence

```json
{
  "name": "Welcome Sequence",
  "nodes": [...],
  "edges": [...]
}
```

#### GET /api/sequences

Get all sequences for the authenticated user

#### POST /api/sequences/:id/schedule

Schedule a sequence for sending

```json
{
  "startTime": "2023-07-10T12:00:00Z",
  "recipientEmail": "recipient@example.com"
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
