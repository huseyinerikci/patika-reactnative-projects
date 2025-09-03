// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth, firestore, COLLECTIONS } from '../../config/firebase';
import { AuthState, User } from '../../types/index';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationInProgress: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const userDoc = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userCredential.user.uid)
      .get();

    const data = userDoc.data() as Partial<User> | undefined;
    const createdAt = (data?.createdAt as any) || Date.now();
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || '',
      photoURL: userCredential.user.photoURL || undefined,
      favoriteBooks: (data?.favoriteBooks as any) || [],
      followersCount: (data?.followersCount as any) ?? 0,
      followingCount: (data?.followingCount as any) ?? 0,
      bio: (data?.bio as any) || '',
      createdAt:
        typeof createdAt === 'number'
          ? createdAt
          : createdAt?.toMillis?.() || Date.now(),
    } as User;
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await userCredential.user.updateProfile({ displayName });

    const newUser: User = {
      uid: userCredential.user.uid,
      email,
      displayName,
      favoriteBooks: [],
      followersCount: 0,
      followingCount: 0,
      createdAt: Date.now(),
    };

    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userCredential.user.uid)
      .set(newUser);

    // Force sign-out after registration so the user must log in explicitly
    await auth().signOut();

    return newUser;
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await auth().signOut();
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {
      displayName,
      bio,
      photoURL,
    }: { displayName?: string; bio?: string; photoURL?: string },
    { getState },
  ) => {
    const { auth: authState } = getState() as { auth: AuthState };
    const user = authState.user;

    if (!user) throw new Error('User not found');

    const updates: Partial<User> = {};
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (photoURL) updates.photoURL = photoURL;

    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(user.uid)
      .update(updates);

    if (displayName || photoURL) {
      const profileUpdate: { displayName?: string; photoURL?: string } = {};
      if (displayName) profileUpdate.displayName = displayName;
      if (photoURL) profileUpdate.photoURL = photoURL;
      await auth().currentUser?.updateProfile(profileUpdate);
    }

    const normalizedCreatedAt = user.createdAt as any;
    return {
      ...user,
      ...updates,
      createdAt:
        typeof normalizedCreatedAt === 'number'
          ? normalizedCreatedAt
          : normalizedCreatedAt?.toMillis?.() || Date.now(),
    } as User;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Giriş başarısız';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.registrationInProgress = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // Do not auto-login after registration
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.registrationInProgress = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationInProgress = false;
        state.error = action.error.message || 'Kayıt başarısız';
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
