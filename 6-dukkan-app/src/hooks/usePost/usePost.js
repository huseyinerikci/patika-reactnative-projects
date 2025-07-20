import axios from 'axios';
import { useState } from 'react';

const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (url, apiData) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const { data: resData } = await axios.post(url, apiData);
      setData(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, post };
};

export default usePost;
