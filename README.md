# **Care Companion 🐾**
A beautifully designed pet care application that helps users manage pet profiles, track activities and health, find nearby veterinary services, and provide feedback — all in one place.

## Introduction
**Care Companion** is a user-friendly web application designed to support pet owners in managing their pet's well-being with ease and confidence. The primary purpose of the project is to centralize all aspects of pet care — from health tracking to daily activities, veterinary needs, and feedback — into one seamless experience.

At its core, **Care Companion** allows users to:

- 👤 Create and manage profiles for multiple pets  
- 🗓️ Log and monitor activities like feeding, walks, playtime, and medication  
- 🏥 Maintain health records, including symptoms, vet visits, prescriptions, and weight tracking  
- 📍 Quickly locate nearby emergency veterinary services with contact info and reviews  
- 📝 Submit feedback to the developer for improvements or issues  

By organizing all pet care needs in a single place, **Care Companion** saves time, reduces stress, and ensures every furry friend receives the best possible care.


## Directory Structure
```
my-app/
├─ backend/
│  ├─ firebase-config.js
│  ├─ auth.js
├─ frontend/
│  ├─ css/
│  │  ├─ index.css
│  │  ├─ signup.css
│  │  ├─ login.css
│  │  ├─ dashboard.css
│  │  ├─ pet-profile.css
│  │  ├─ edit-pet.css
│  │  ├─ activity.css
│  │  ├─ vet.css
│  │  ├─ health.css
│  │  ├─ feedback.css
│  ├─ html/
│  │  ├─ index.html
│  │  ├─ signup.html
│  │  ├─ login.html
│  │  ├─ dashboard.html
│  │  ├─ pet-profile.html
│  │  ├─ edit-pet.html
│  │  ├─ activity.html
│  │  ├─ vet.html
│  │  ├─ health.html
│  │  ├─ feedback.html
│  ├─ javascript/
│  │  ├─ vet.js
│  │  ├─ feedback.js
│  │  ├─ activity.js
│  │  ├─ health.js
│  │  ├─ dashboard.js
│  │  ├─ pet-profile.js
│  │  ├─ auth.js
│  │  ├─ index.js
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ icons/
├─ README.md
```

## Features
1. User Authentication: Secure signup, login, and password recovery.
2. Pet Profile Management: Create, view, and edit multiple pet profiles.
3. Dashboard: View all pets and easily switch between profiles.
4. Activity Tracking: Log and view pet activities like walks and playtime.
5. Health Records: Track weight, log health symptoms, and get health recommendations.
6. Vet Locator: Find nearby emergency veterinary services with contact details and directions.
7. Feedback System: Submit feedback and contact support via email.
8. User-Friendly Interface: Aesthetic, responsive design with intuitive navigation.
9. Firebase Integration: Secure storage and real-time updates of pet and user data.

## Design Decisions
1. Responsive Design: Mobile-first approach using Flexbox and CSS Grid for a seamless experience across devices.
2. User-Centered Interface: Clean, intuitive design with soft, welcoming colors.
3. Firebase Backend: Firebase for real-time data syncing, user authentication, and Firestore for structured pet data storage.
4. Pet Profiles: Each pet has its own document under the user’s subcollection for efficient data management.
5. Activity & Health Tracking: Logs and health records with recommendations for pet wellness.
6. Vet Locator: Google Maps API integrated for location-based vet searches.
7. Feedback System: Simple form for collecting user feedback, stored in Firestore.
8. Security: Firebase Authentication and Firestore rules for secure user data management.
9. Error Handling: Alerts and messages for success or failure.
10. Emojis: Used to make the app feel friendly and engaging.

## Installation & Getting started

```bash
clone 
cd my-project
npm install
npm run dev
```

## APIs Used
- <u>Google Maps API</u>: Used for the Vet Locator feature to find nearby emergency veterinary services.
API Documentation: [Google Maps API](https://developers.google.com/maps/documentation/javascript)

- Firebase</u>: Used for authentication and data storage, including user profiles and pet information.
API Documentation: [Firebase Documentation](https://firebase.google.com/docs)

## Technology Stack
Here’s a list and brief overview of the technologies used in the **Care Companion** project:

- <u>Firebase Console</u>: Used for authentication, Firestore database, and hosting backend services for storing user, pet, and activity data securely.

- <u>JavaScript (Vanilla JS)</u>: Powers the client-side interactivity including form handling, Firebase integration, and dynamic rendering of content.

- <u>HTML5 & CSS3</u>: Markup and styling for all UI pages. Ensures a clean, aesthetic, and responsive design across the app.

- <u>Chart.js Library</u>: Utilized in the Health Tracker to display pet weight trends through interactive line charts.

- <u>Google Maps API</u>: Integrated for the Vet Locator feature to find nearby veterinary clinics with contact info and directions.

## Author: Pooja Jaiswal
