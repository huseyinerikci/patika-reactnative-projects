# 🍽️ Worldwide Restaurants App

Discover the best restaurants near you with a modern and user-friendly React Native app. Yelp API integration provides real-time restaurant data, a map view, and detailed restaurant information.

## 📱 Preview

![App GIF](public/restoran-app.gif)

## ✨ Features

- 🔍 Advanced Search - Search by restaurant, cuisine, or city
- 🗺️ Map View - View restaurants on a map
- 📍 Location-Based - Automatically find nearby restaurants
- 📊 Detailed Information - Ratings, reviews, and opening hours
- 🕒 Opening Hours - Daily opening and closing times
- 📞 Direct Contact - Phone calls and directions
- 🎨 Modern Design - Gradient colors and smooth animations
- 📱 Responsive - Compatible with all screen sizes

### Home

- Modern gradient header design
- Search restaurants with the search bar
- Detailed information with restaurant cards

### Map View

- View restaurants on the map
- Detailed information by clicking on markers
- Location-based search

### Detail Page

- Restaurant photos
- Ratings and reviews
- Opening hours
- Contact information

## Requirements

- Node.js >= 20
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)
- Yelp API Key

### Set Your Yelp API Key

Add your Yelp API key in the `src/services/yelp.ts` file:

```typescript
const YELP_API_KEY = 'YOUR_YELP_API_KEY_HERE';
```

### 📋 API Integration

App using the Yelp Fusion API:

- Restaurant search (`/businesses/search`)
- Restaurant details (`/businesses/{id}`)
- Restaurant reviews (`/businesses/{id}/reviews`)
- Note: Reviews are not visible on the free plan.

### 🎨 Design System

- **Colors**: Modern gradient palette
- **Typography**: Hierarchical font sizes
- **Spacing**: Consistent margin/padding system
- **Shadows**: Shadow effects for a sense of depth

## 🛠️ Technologies Used

- **React Native 0.82.0** - Mobile app development
- **TypeScript** - Type safety
- **React Navigation** - Navigation management
- **React Native Maps** - Map integration
- **Yelp API** - Restaurant data
- **AsyncStorage** - Local data storage
- **React Native Vector Icons** - Icons
- **Linear Gradient** - Gradient designs
