import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore, COLLECTIONS } from '../../config/firebase';
import { Post, PostsState, Comment } from '../../types';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const initialState: PostsState = {
  posts: [],
  userPosts: [],
  loading: false,
  error: null,
};

// createPost: fetch + Blob ile modular storage
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({
    userId,
    userName,
    userAvatar,
    bookTitle,
    bookAuthor,
    bookGenre,
    bookCover,
    content,
    rating,
    imageUris,
  }: {
    userId: string;
    userName: string;
    userAvatar?: string;
    bookTitle: string;
    bookAuthor: string;
    bookGenre: string;
    bookCover?: string;
    content: string;
    rating: number;
    imageUris: string[];
  }) => {
    const storage = getStorage();
    const uploadedImageUrls: string[] = [];

    for (const uri of imageUris) {
      const filename = `${Date.now()}-${Math.random().toString(36)}`;
      const storageRef = ref(storage, `post_images/${filename}`);

      // fetch ile URI'den blob al
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      uploadedImageUrls.push(downloadURL);
    }

    const now = new Date();

    const newPost: Omit<Post, 'id'> = {
      uid: userId,
      userId,
      userName,
      userAvatar,
      bookTitle,
      bookAuthor,
      bookGenre,
      bookCover,
      content,
      images: uploadedImageUrls,
      rating,
      likes: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await firestore()
      .collection(COLLECTIONS.POSTS)
      .add({
        ...newPost,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    return { id: docRef.id, ...newPost } as Post;
  },
);

export const loadPosts = createAsyncThunk('posts/loadPosts', async () => {
  const snapshot = await firestore()
    .collection(COLLECTIONS.POSTS)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
    } as Post;
  });
});

export const loadUserPosts = createAsyncThunk(
  'posts/loadUserPosts',
  async (userId: string) => {
    const snapshot = await firestore()
      .collection(COLLECTIONS.POSTS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Post[];
  },
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const postRef = firestore().collection(COLLECTIONS.POSTS).doc(postId);
    const postDoc = await postRef.get();
    const postData = postDoc.data();

    if (postData) {
      const likes = postData.likes || [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        await postRef.update({
          likes: firestore.FieldValue.arrayRemove(userId),
        });
      } else {
        await postRef.update({
          likes: firestore.FieldValue.arrayUnion(userId),
        });
      }

      return { postId, userId, isLiked: !isLiked };
    }

    throw new Error('Post not found');
  },
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({
    postId,
    userId,
    userName,
    userAvatar,
    content,
  }: {
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
  }) => {
    const comment: Comment = {
      id: Date.now().toString(),
      userId,
      userName,
      userAvatar,
      content,
      createdAt: new Date(),
    };

    await firestore()
      .collection(COLLECTIONS.POSTS)
      .doc(postId)
      .update({
        comments: firestore.FieldValue.arrayUnion(comment),
      });

    return { postId, comment };
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createPost.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.userPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Gönderi oluşturulamadı';
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(loadUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId, isLiked } = action.payload;
        const updatePost = (post: Post) => {
          if (post.id === postId) {
            if (isLiked) {
              post.likes = [...post.likes, userId];
            } else {
              post.likes = post.likes.filter(id => id !== userId);
            }
          }
        };
        state.posts.forEach(updatePost);
        state.userPosts.forEach(updatePost);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const updatePost = (post: Post) => {
          if (post.id === postId) {
            post.comments.push(comment);
          }
        };
        state.posts.forEach(updatePost);
        state.userPosts.forEach(updatePost);
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
