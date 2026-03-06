# Inventory Tracker (FERN based app)

A simple inventory tracker CRUD application built with **React (Vite)**, **Express**, and **Firebase Firestore**.

## Features:
- Dashboard to view all products
- Add new items
- Delete items on the dashboard
- Update existing items
- Express REST API between frontend and Firestore

## Tech Stack used:
- Frontend: React
- Backend: Node.js + Express
- Database: Firestore
- HTTP Client: Axios

## Project Structure:
- /client: React frontend, components, and state management
- /server: Express routes, middleware, and Firebase Admin logic

## API Documentation: 
All endpoints are prefixed with /api/items. 

POST / - Create a new item

GET  / - List all items 

GET  /:id - Get details of specific item 

PUT  /:id - Update item fields 

DELETE /:id - Soft Delete (Marks item as deleted without removing it from Firestore)

DELETE /:id/hard - Hard Delete (Permanently removes item from Firestore) 

## Usage Guide:
1. Dashboard: Upon oppening the app, you will see all the items
2. Adding Items: Click "Add Product." Fill in the details and save.
3. Updating Items: Click the "Edit" button on any item to change details.
4. Deleting: Click the "Delete" button to soft delete the item. 


