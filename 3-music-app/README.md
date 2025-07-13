# 🎵 Music App

A modern React Native music application with search functionality and beautiful UI design.

![Music App Preview](public/music-app.gif)

## ✨ Features

- **🎵 Music Library**: Browse through a curated collection of songs from various artists and genres
- **🔍 Real-time Search**: Search songs by title with instant filtering
- **📱 Responsive Design**: Beautiful and modern UI that works on both iOS and Android
- **🎨 Song Cards**: Detailed song information including artist, album, year, and album artwork
- **⚡ Fast Performance**: Optimized with React Native for smooth user experience
- **🎯 User-friendly Interface**: Clean and intuitive design with proper error handling

## 🛠️ Technologies

- **React Native 0.80.1** - Cross-platform mobile development framework
- **React 19.1.0** - JavaScript library for building user interfaces
- **JavaScript** - Primary programming language

## 📱 App Structure

```
src/
├── App.js                 # Main application component
├── music-data.json        # Song data
└── components/
    ├── SongCard/          # Individual song display component
    ├── SearcBar/          # Search functionality component
    └── NotFound/          # No results found component
```

## 🎯 Key Features Explained

### Search Functionality

- Real-time filtering as you type
- Case-insensitive search
- Instant results display
- Graceful handling of no results

### Song Display

- Album artwork integration
- Complete song metadata (title, artist, album, year)
- Sold-out status indicators
- Clean card-based layout

### User Experience

- Smooth scrolling with FlatList optimization
- Proper loading states
- Error boundaries
- Responsive design for different screen sizes
