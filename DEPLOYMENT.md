# Deployment Guide - Lumina Luxury

## 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create or select your project.
3. Enable **Firestore Database** in production mode.
4. Enable **Firebase Storage**.
5. Enable **Authentication** and activate the **Email/Password** provider (for Admin).
6. Create an admin user manually in the Auth tab.

## 2. Environment Variables
Set the following variables in your hosting provider (Vercel, etc.):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=(default) 
```
*Note: If using AI Studio provisioned database, check your `firebase-applet-config.json` for the exact Database ID.*

## 3. GitHub Deployment
1. Initialize git: `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Initial luxury release"`
4. Push to your repository.

## 4. Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Select **Vite** as the framework.
3. Add the environment variables.
4. Deploy.

## 5. Security Rules
Deploy the `firestore.rules` provided in this project using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
Or copy-paste them into the Firebase Console Rules tab.
