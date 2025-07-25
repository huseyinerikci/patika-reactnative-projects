import axios from 'axios';
import React, { useEffect, useState } from 'react';

const useFetch = url => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dataFetch();
  }, []);

  const dataFetch = async () => {
    try {
      const { data } = await axios.get(url);
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error };
};

export default useFetch;
