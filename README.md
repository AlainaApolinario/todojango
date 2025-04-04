# React + Vite + Django Todo App

This project is a full-stack Todo application built with React (frontend) and Django (backend). The frontend is powered by Vite for fast development, and the backend uses Django REST Framework for API management.

## Features

- Add, edit, delete, and toggle tasks.
- Dark mode toggle.
- Responsive design for all devices.
- Backend API built with Django REST Framework.
- CORS support for frontend-backend communication.

---

## API Endpoints

### Base URL

The backend API is hosted at:  
`https://todojango.onrender.com/api/`

### Endpoints

1. **Get All Tasks**  
   **GET** `/tasks/`  
   Returns a list of all tasks.

   **Response Example**:

   ```json
   [
     {
       "id": 1,
       "text": "Buy groceries",
       "completed": false
     },
     {
       "id": 2,
       "text": "Walk the dog",
       "completed": true
     },
     {
       "id": 3,
       "text": "Updated Task",
       "completed": true
     }
   ]
   ```
