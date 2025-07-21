# Dükkan App

Dükkan App is a simple mobile app to list products and view their details. Built with React Native.

## Preview

![App Preview](src/assets/dukkan-app.gif)

## Features

- User authentication (login with username & password)
- Secure user session with AsyncStorage
- Fetches products from a remote API
- Lists products as cards with modern UI
- Each product has a detail page
- Animated loading and error states
- Welcome message with user info
- Responsive and smooth scrolling experience
- Error handling and feedback with alerts

## Technologies Used

- React Native
- React Navigation
- Axios
- Lottie-react-native
- Redux (for global state management)
- Formik (for forms)
- react-native-vector-icons (FontAwesome6 support)
- @react-native-async-storage/async-storage
- dotenv (.env config support)

## Installation & Usage

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd storeapp
   ```

````
2. Install dependencies:
   ```sh
npm install
# or
yarn
````

3. Set your API address in the .env file.
4. For Android:
   ```sh
   npm run android
   ```

# or

yarn android

````
   For iOS (if first time):
   ```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
# or
yarn ios
````

> You must add your API address as `API_URL` in the `.env` file. Example:
>
>     API_URL=https://fakestoreapi.com
>     API_AUTH_URL=https://fakestoreapi.com/auth
