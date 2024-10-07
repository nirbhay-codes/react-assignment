import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/');
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/card/credit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count: 250,
            country_code: 'en_IN',
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setCardData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  if (!user) {
    return null; // or redirect to login as already done in useEffect
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
      <p className='text-xl'>Hello, {user.email}</p>

      {/* Card Data Table */}
      {loading && <div>Loading card data...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && cardData.length > 0 && (
        <div className="mt-6">
          <h2 className='text-2xl font-bold mb-4'>Card Data</h2>
          <table className='min-w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-4 py-2'>Card Provider</th>
                <th className='border border-gray-300 px-4 py-2'>Card Digits</th>
                <th className='border border-gray-300 px-4 py-2'>Card Number</th>
                <th className='border border-gray-300 px-4 py-2'>Card Expiry</th>
                <th className='border border-gray-300 px-4 py-2'>Card Type</th>
                <th className='border border-gray-300 px-4 py-2'>CVV</th>
              </tr>
            </thead>
            <tbody>
              {cardData.map((card, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='border border-gray-300 px-4 py-2'>{card.card_provider}</td>
                  <td className='border border-gray-300 px-4 py-2'>{card.digits}</td>
                  <td className='border border-gray-300 px-4 py-2'>{card.card_number}</td>
                  <td className='border border-gray-300 px-4 py-2'>{card.card_expiry}</td>
                  <td className='border border-gray-300 px-4 py-2'>{card.card_type}</td>
                  <td className='border border-gray-300 px-4 py-2'>{card.cvv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
