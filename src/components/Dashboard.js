import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [cardData, setCardData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(
          'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/card/credit',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              count: 10, // 250
              country_code: 'en_IN',
            }),
          }
        );

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

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/profile',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              count: 10, //150
              country_code: 'en_IN',
              aadhar: true,
              dl: true,
              credit: true,
              debit: true,
              pan: true,
              passport: true,
              ssn: false,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const result = await response.json();
        setProfileData(result.data);
      } catch (err) {
        setProfileError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCardData();
    fetchProfileData();
  }, []);

  if (!user) {
    return null; // or redirect to login as already done in useEffect
  }

  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
      </div>

      <p className='text-xl mb-6'>Hello, {user.email}</p>

      {/* Card Data Table */}
      {loading && <div>Loading card data...</div>}
      {error && <div className='text-red-600'>Error: {error}</div>}
      {!loading && !error && cardData.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4'>Card Data</h2>
          <table className='min-w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-4 py-2'>
                  Card Provider
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Card Digits
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Card Number
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Card Expiry
                </th>
                <th className='border border-gray-300 px-4 py-2'>Card Type</th>
                <th className='border border-gray-300 px-4 py-2'>CVV</th>
              </tr>
            </thead>
            <tbody>
              {cardData.map((card, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.card_provider}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.digits}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.card_number}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.card_expiry}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.card_type}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {card.cvv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Data Table */}
      {profileLoading && <div>Loading profile data...</div>}
      {profileError && (
        <div className='text-red-600'>Error: {profileError}</div>
      )}
      {!profileLoading && !profileError && profileData.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-2xl font-bold mb-4'>Profile Data</h2>
          <table className='min-w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-300 px-4 py-2'>First Name</th>
                <th className='border border-gray-300 px-4 py-2'>Last Name</th>
                <th className='border border-gray-300 px-4 py-2'>Gender</th>
                <th className='border border-gray-300 px-4 py-2'>
                  Date of Birth
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Father's Name
                </th>
                <th className='border border-gray-300 px-4 py-2'>Address</th>
                <th className='border border-gray-300 px-4 py-2'>Aadhar</th>
                <th className='border border-gray-300 px-4 py-2'>
                  Credit Card Number
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Credit Card CVV
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Credit Card Expiry
                </th>
                <th className='border border-gray-300 px-4 py-2'>
                  Credit Card Provider
                </th>
              </tr>
            </thead>
            <tbody>
              {profileData.map((profile, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.first_name}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.last_name}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.sex}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.dob}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.father_name}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.address}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.aadhar}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.credit_card_number}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.credit_card_cvv}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.credit_card_expiry}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    {profile.credit_card_provider}
                  </td>
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
