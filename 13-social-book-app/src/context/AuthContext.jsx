import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        setUser(authUser);
        // Kullanıcı verilerini Firestore'dan al
        const userDoc = await firestore()
          .collection('users')
          .doc(authUser.uid)
          .get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, fullName) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Kullanıcı profilini Firestore'a kaydet
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        email: email,
        fullName: fullName,
        avatar: null,
        favoriteBooks: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async updates => {
    try {
      if (user) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            ...updates,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

        // Local state'i güncelle
        setUserData(prev => ({ ...prev, ...updates }));
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
