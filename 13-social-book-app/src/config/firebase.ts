// config/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export { auth, firestore, storage };

export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  BOOKS: 'books',
  COMMENTS: 'comments',
} as const;

export const STORAGE_PATHS = {
  POST_IMAGES: 'post-images',
  PROFILE_IMAGES: 'profile-images',
  BOOK_COVERS: 'book-covers',
} as const;
