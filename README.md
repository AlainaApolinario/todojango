# React + Vite + Django Todo App

This project is a full-stack Todo application built with React (frontend) and Django (backend). The frontend is powered by Vite for fast development, and the backend uses Django REST Framework for API management.

---

## Features

- Add, edit, delete, and toggle tasks.
- Dark mode toggle.
- Responsive design for all devices.
- Backend API built with Django REST Framework.
- CORS support for frontend-backend communication.

---

## API Endpoints

The API for this project is built using **Django REST Framework**. It is hosted at:  
`https://todojango.onrender.com/api/`

### 1. **Get All Tasks**

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
  }
]
```

### 2. **Add a New Task**

**POST** `/tasks/`  
 Creates a new task.

**Request Body Example**:

```json
{
  "text": "New Task",
  "completed": false
}
```

**Response Example**:

```json
{
  "id": 3,
  "text": "New Task",
  "completed": false
}
```

### 3. **Update a Task**

**PATCH** `/tasks/<id>/`  
 Updates the specified task.

**Request Body Example**:

```json
{
  "text": "Updated Task",
  "completed": true
}
```

**Response Example**:

```json
{
  "id": 3,
  "text": "Updated Task",
  "completed": true
}
```

### 4. **Delete a Task**

**DELETE** `/tasks/<id>/`  
 Deletes the specified task.

**Response**:  
 Returns a `204 No Content` status on success.

---

## How to Run the Project

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Deployment

### Backend

The backend is deployed on Render at:  
`https://todojango.onrender.com`

### Frontend

The frontend is deployed on GitHub Pages at:  
`https://alainaapolinario.github.io/todojango/`

---

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Django, Django REST Framework
- **Deployment**: Render (backend), GitHub Pages (frontend)
