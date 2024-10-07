import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TODO - fix issue with table vanishing after 10th page
const Dashboard = () => {
  const { user } = useAuth();
  // const navigate = useNavigate();

  // Card data states
  const [cardData, setCardData] = useState([]);

  const [cardPage, setCardPage] = useState(1); // Current page for card
  const [cardPageSize] = useState(10); // Records per page
  const [totalCardRecords, setTotalCardRecords] = useState(250); // Fixed total count for card data

  const [profileData, setProfileData] = useState([]);

  const [profilePage, setProfilePage] = useState(1); // Current page for profile data
  const [profilePageSize] = useState(10); // Records per page
  const [totalProfileRecords, setTotalProfileRecords] = useState(150); // Fixed total count for profile data

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch card data (250 records max)
  const fetchCardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/card/credit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count: 250, // Fetch all 250 records in one go
            country_code: 'en_IN',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch card data');
      }

      const result = await response.json();
      setCardData(result.data); // Store the full data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data (150 records max)
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/profile',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count: 150, // Fetch all 150 records in one go
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
      setProfileData(result.data); // Store the full profile data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    fetchCardData();
    fetchProfileData();
  }, []);

  // Common function to handle pagination
  const handlePageChange = (type, direction) => {
    if (type === 'card') {
      if (
        direction === 'next' &&
        cardPage < Math.ceil(totalCardRecords / cardPageSize)
      ) {
        setCardPage((prevPage) => prevPage + 1);
      } else if (direction === 'prev' && cardPage > 1) {
        setCardPage((prevPage) => prevPage - 1);
      }
    } else if (type === 'profile') {
      if (
        direction === 'next' &&
        profilePage < Math.ceil(totalProfileRecords / profilePageSize)
      ) {
        setProfilePage((prevPage) => prevPage + 1);
      } else if (direction === 'prev' && profilePage > 1) {
        setProfilePage((prevPage) => prevPage - 1);
      }
    }
  };

  // Get current data to display based on pagination
  const currentCardData = cardData.slice(
    (cardPage - 1) * cardPageSize,
    cardPage * cardPageSize
  ); // slice(0, 10) -> 10th ele is excluded i.e. so 0th to 9th index, then next slice(10, 20) and so on ...
  const currentProfileData = profileData.slice(
    (profilePage - 1) * profilePageSize,
    profilePage * profilePageSize
  );

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
      <p className='text-xl mb-6'>Hello, {user}</p>

      {/* Card Data Table */}
      <div>
        {loading && <div>Loading card data...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && currentCardData.length > 0 && (
          <div>
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
                  <th className='border border-gray-300 px-4 py-2'>
                    Card Type
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>CVV</th>
                </tr>
              </thead>
              <tbody>
                {currentCardData.map((card, index) => (
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

            {/* Pagination */}
            <div className='flex justify-center items-center mt-4'>
              <button
                onClick={() => handlePageChange('card', 'prev')}
                disabled={cardPage === 1}
                className='bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Previous
              </button>
              <span>
                Page {cardPage} of {Math.ceil(totalCardRecords / cardPageSize)}
              </span>
              <button
                onClick={() => handlePageChange('card', 'next')}
                disabled={
                  cardPage === Math.ceil(totalCardRecords / cardPageSize)
                }
                className='bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Data Table */}
      <div>
        {loading && <div>Loading profile data...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && currentProfileData.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Profile Data</h2>
            <table className='min-w-full border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>
                    First Name
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Last Name
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>Email</th>
                  <th className='border border-gray-300 px-4 py-2'>Aadhar</th>
                  <th className='border border-gray-300 px-4 py-2'>PAN</th>
                </tr>
              </thead>
              <tbody>
                {currentProfileData.map((profile, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.first_name}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.last_name}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.email}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.aadhar}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.pan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className='flex justify-center items-center mt-4'>
              <button
                onClick={() => handlePageChange('profile', 'prev')}
                disabled={profilePage === 1}
                className='bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Previous
              </button>
              <span>
                Page {profilePage} of{' '}
                {Math.ceil(totalProfileRecords / profilePageSize)}
              </span>
              <button
                onClick={() => handlePageChange('profile', 'next')}
                disabled={
                  profilePage ===
                  Math.ceil(totalProfileRecords / profilePageSize)
                }
                className='bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
