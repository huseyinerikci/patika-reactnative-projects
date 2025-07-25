# 📱 KodWork

**KodWork** is a job-search mobile application built with React Native. Users can browse job listings, view detailed job information, and save their favorite jobs for later access.

## 📽️ Preview

![KodWork App Preview](./src/assets/kodwork-app.gif)

## 🚀 Features

- 🎯 **Job Listings:**  
  Fetches and displays job data from the [TheMuse API](https://www.themuse.com/api/public/jobs) in a card-based layout.

- 📄 **Job Details:**  
  View detailed information about each job, including description, location, and level.

- ❤️ **Add/Remove Favorites:**  
  Users can add jobs to their favorites list and remove them when desired.

- 🔄 **Persistent Storage:**  
  Favorite jobs are stored using AsyncStorage, so they remain saved even after the app is closed.

- 🔧 **State Management:**  
  Global state is managed with Redux for efficient and predictable data handling.

- 🧭 **Navigation:**  
  Utilizes Drawer and Stack Navigation for a seamless user experience.

## 🧩 Technologies & Libraries

| Category              | Libraries / Technologies                 |
| --------------------- | ---------------------------------------- |
| **Core**              | React Native 0.80.1, React 19.1.0        |
| **State Management**  | Redux, React Redux, Redux Toolkit        |
| **API Communication** | Axios                                    |
| **Navigation**        | React Navigation (Drawer + Native Stack) |
| **Data Storage**      | AsyncStorage                             |
| **Icons**             | React Native Vector Icons, FontAwesome6  |
| **Animations**        | Lottie React Native                      |
| **HTML Rendering**    | React Native Render HTML                 |
| **Environment Vars**  | React Native Config                      |
| **Gestures**          | React Native Gesture Handler, Reanimated |

## 🔗 API Source

The job data is fetched from the **[TheMuse Public API](https://www.themuse.com/api/public/jobs)**.

## ⚙️ Installation

```bash
git clone https://github.com/your-username/kodwork.git
cd kodwork
npm install
npx react-native run-android  # or run-ios
```
