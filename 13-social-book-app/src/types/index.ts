import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  favoriteBooks: Book[];
  followersCount: number;
  followingCount: number;
  createdAt: number; // unix ms
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage?: string;
  isbn?: string;
  description?: string;
  publishedYear?: number;
  rating?: number;
  addedAt: Date;
}

export interface Post {
  id: string;
  uid: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  bookTitle: string;
  bookAuthor: string;
  bookGenre: string;
  bookCover?: string;
  content: string;
  images: string[];
  rating: number;
  likes: string[]; // user IDs who liked
  comments: Comment[];
  createdAt: Date | FirebaseFirestoreTypes.FieldValue;
  updatedAt: Date | FirebaseFirestoreTypes.FieldValue;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface RootState {
  auth: AuthState;
  books: BooksState;
  posts: PostsState;
  users: UsersState;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationInProgress?: boolean;
}

export interface BooksState {
  favoriteBooks: Book[];
  searchResults: Book[];
  loading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  userPosts: Post[];
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  currentProfile: User | null;
  searchResults: User[];
  loading: boolean;
  error: string | null;
}

export interface BookApiResponse {
  docs: {
    title: string;
    author_name: string[];
    cover_i?: number;
    isbn?: string[];
    first_publish_year?: number;
    subject?: string[];
  }[];
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  AddPost: undefined;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
  BookDetail: { book: Book };
};
