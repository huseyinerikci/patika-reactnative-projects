import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetch = url => {
  const [data, setData] = useState({ meals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: resData } = await axios.get(url);
      setData(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
};

export default useFetch;
