import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, firestore, COLLECTIONS } from '../config/firebase';
import { setUser } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { User } from '../types';

const AuthListener: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { registrationInProgress } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        // If we are in the middle of a registration flow that signs out, avoid flicker to Main
        if (registrationInProgress) {
          return;
        }
        try {
          // Get user data from Firestore
          const userDoc = await firestore()
            .collection(COLLECTIONS.USERS)
            .doc(firebaseUser.uid)
            .get();

          const userData = userDoc.data();

          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName:
              firebaseUser.displayName || userData?.displayName || '',
            photoURL: firebaseUser.photoURL || userData?.photoURL,
            bio: userData?.bio,
            favoriteBooks: userData?.favoriteBooks || [],
            followersCount: userData?.followersCount || 0,
            followingCount: userData?.followingCount || 0,
            createdAt:
              typeof userData?.createdAt === 'number'
                ? userData?.createdAt
                : userData?.createdAt?.toMillis?.() || Date.now(),
          };

          dispatch(setUser(user));
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return null;
};

export default AuthListener;
