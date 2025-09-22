import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useUserPoints = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        setLoading(true);
        const result = await apiService.get('/api/v1/users/points');
        setTotalPoints(result.data.totalPoints || 0);
      } catch (err) {
        console.error('Error fetching user points:', err);
        setError(err.message);
        setTotalPoints(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  return { totalPoints, loading, error };
};
