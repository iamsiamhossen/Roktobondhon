import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else if (!user.emailVerified) {
        navigate('/verify-email');
      } else {
        setLoading(false); // User exists and is verified
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">লোড হচ্ছে...</div>;

  return children;
};

export default PrivateRoute;
