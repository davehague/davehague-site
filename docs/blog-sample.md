# Image examples below

Here's an image: ![A beautiful landscape](https://images.pexels.com/photos/27938384/pexels-photo-27938384/free-photo-of-eagle-nebula.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 "Scenic mountain view")

<img src="https://images.pexels.com/photos/24778745/pexels-photo-24778745/free-photo-of-back-view-of-a-person-watching-a-volcano-eruption.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A beautiful landscape" width="300" align="right">

<img src="/images/question.png" alt="A beautiful landscape" width="300" align="left">

![Centered image](https://images.pexels.com/photos/27938384/pexels-photo-27938384/free-photo-of-eagle-nebula.jpeg)
_This is a caption for the centered image_

![Centered image](/images/commission-control.png)
_This is a caption for the centered image_

<img src="/images/jobs-app.gif" align="left" alt="Right-aligned image" width="300">
This text will wrap around the right-aligned image.

---

# Commission Tracker

## Project Overview

Commission Tracker is a FastAPI-based application designed to help insurance agents reconcile their
system of record with multiple insurance carriers, with a focus on commission tracking.
The application aims to address discrepancies between agent records and carrier records,
which can lead to issues such as delayed or missed commission payments.

## Technology Stack

- Backend: Python with FastAPI
- Database ORM: SQLAlchemy
- Database Migrations: Alembic
- Database: PostgreSQL
- Development Environment: PyCharm IDE, venv for virtual environment, pip for package management

## Project Structure

### Folder Purposes

- `app/api/`: Contains route definitions for API endpoints.
- `app/core/`: Houses core functionality and configurations (e.g., database connections, settings).
  Also contains business logic and common functions.
- `app/crud/`: Contains CRUD (Create, Read, Update, Delete) operations for database interactions.
- `add/dependencies/`: Contains dependency injection functions for FastAPI.  
  Authentication dependencies are in the `auth.py` file.
- `app/middleware`: Contains middleware functions for FastAPI. `auth.py` contains the JWT token
  verification middleware.
- `app/models/`: Defines SQLAlchemy models representing database tables.
- `app/schemas/`: Contains Pydantic models for request/response data validation and serialization.

**Other noteable files**

- `app/core/config.py`: Reads environment variables from the `.env` file (see section below for listing)
  and provides them as settings.
- `app/api/__init__.py`: Dynamically include routes by reading the files in the `app/api/` directory.
- `app/core/utils.py`: Contains utility functions for common tasks.
- `app/__init__.py`: Dynamically includes schemas and crud files (`from .schemas import *`), but models are imported explicitly
  for ordering purposes.
- `main.py`: Entry point for the FastAPI application. Sets up the AuthMiddleware, CorsMiddleware, RateLimiter, and
  defines a few base endpoints (e.g., `/` to send a simple message and `/health` for a simple health check). Also contains
  generic error handlers.

## Setup and Installation

1. Clone the repository
2. Set up a virtual environment:

```commandline
python -m venv venv
source venv/bin/activate  // On Windows use venv\Scripts\activate
```

3. Install dependencies:

```commandline
pip install -r requirements.txt
```

4. Set up your `.env` file with your database URL:

```commandline
DEBUG=True

PROJECT_NAME=Commission Control API
HOST=localhost
PORT=8000

DATABASE_URL=postgresql://postgres:<password>@localhost/commission_tracker

JWT_SECRET=<your-jwt-secret>
CORS_ORIGINS=http://localhost:3000
```

5. Run database migrations:

```commandline
alembic upgrade head
```

6. Start the FastAPI server:

```commandline
uvicorn main:app --reload
```

## API Documentation

Once the server is running, you can access the Swagger UI documentation at `http://localhost:8000/docs`
This provides an interactive interface to explore and test the API endpoints.

## Creating migrations

Run the following command to create a new migration:

```commandline
alembic revision --autogenerate -m "Add User table"
```

Review the generated migration file in the alembic/versions/ directory to ensure it correctly represents the changes.

### Applying the migration

Run the following command to apply the migration:

```commandline
alembic upgrade head
```

**Other Alembic notes**

- There are several ways to view the history of migrations: `alembic history`
- View current applied migration: `alembic current`
- Applying Migrations: `alembic upgrade head`
- Create an empty migration: `alembic revision -m "Work performed message here"`
- Sync models with the database: `alembic revision --autogenerate -m "Sync models and database"`
- View the current revision the database is running: `SELECT * FROM alembic_version;`
