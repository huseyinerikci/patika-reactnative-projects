import AsyncStorage from '@react-native-async-storage/async-storage';

const initialstate = {
  list: [],
  isLoading: true,
  error: null,
};
export default reducers = (state = initialstate, action) => {
  switch (action.type) {
    case 'LIST_LOADING':
      return { ...state, isLoading: true };
    case 'LIST_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LIST_SUCCESS':
      return { ...state, isLoading: false, error: null, list: action.payload };
    case 'ADD_TO_LIST':
      const updated = state.list.concat(action.payload);
      AsyncStorage.setItem('@JOBS', JSON.stringify(updated));
      return { ...state, list: updated };
    case 'REMOVE_FROM_LIST':
      const filtered = state.list.filter(i => i.id !== action.payload.id);
      AsyncStorage.setItem('@JOBS', JSON.stringify(filtered));
      return { ...state, list: filtered };

    default:
      return state;
  }
};
