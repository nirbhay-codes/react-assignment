import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Card data states
  const [cardData, setCardData] = useState([]);
  const [cardPage, setCardPage] = useState(1);
  const [cardPageSize] = useState(10);
  const [totalCardRecords] = useState(100);

  // Profile states
  const [profileData, setProfileData] = useState([]);
  const [profilePage, setProfilePage] = useState(1);
  const [profilePageSize] = useState(10);
  const [totalProfileRecords] = useState(100);

  // Search states
  const [cardSearchTerm, setCardSearchTerm] = useState('');
  const [profileSearchTerm, setProfileSearchTerm] = useState('');

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch card data
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
            count: 100,
            country_code: 'en_IN',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch card data');
      }

      const result = await response.json();
      setCardData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data
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
            count: 100,
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
    fetchProfileData();
  }, []);

  const handlePageChange = (type, direction) => {
    if (type === 'card') {
      const maxPage = Math.ceil(totalCardRecords / cardPageSize);
      if (direction === 'next' && cardPage < maxPage) {
        setCardPage((prevPage) => prevPage + 1);
      } else if (direction === 'prev' && cardPage > 1) {
        setCardPage((prevPage) => prevPage - 1);
      }
    } else if (type === 'profile') {
      const maxPage = Math.ceil(totalProfileRecords / profilePageSize);
      if (direction === 'next' && profilePage < maxPage) {
        setProfilePage((prevPage) => prevPage + 1);
      } else if (direction === 'prev' && profilePage > 1) {
        setProfilePage((prevPage) => prevPage - 1);
      }
    }
  };

  // Get current data array to display based on pagination
  const currentCardData = cardData
    .filter(
      (card) =>
        card.card_number.toString().includes(cardSearchTerm.toLowerCase()) // Filter for card number search
    ) // Filter for card search
    .slice((cardPage - 1) * cardPageSize, cardPage * cardPageSize);

  const currentProfileData = profileData
    .filter(
      (profile) =>
        profile.first_name
          .toLowerCase()
          .includes(profileSearchTerm.toLowerCase()) || // Filter for profile search
        profile.last_name
          .toLowerCase()
          .includes(profileSearchTerm.toLowerCase()) ||
        profile.aadhar
          .toLowerCase()
          .includes(profileSearchTerm.toLowerCase()) ||
        profile.credit_card_number
          .toLowerCase()
          .includes(profileSearchTerm.toLowerCase()) ||
        profile.debit_card_number
          .toLowerCase()
          .includes(profileSearchTerm.toLowerCase())
    )
    .slice((profilePage - 1) * profilePageSize, profilePage * profilePageSize);

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to your Dashboard</h1>
      <p className='text-xl mb-6'>Hello, {user}</p>

      {/* Card Search */}
      <input
        type='text'
        placeholder='Search Card Number...'
        className='border border-gray-300 rounded-md p-2 mb-4 w-full'
        value={cardSearchTerm}
        onChange={(e) => setCardSearchTerm(e.target.value)}
      />

      {/* Card Data Table */}
      <div>
        {loading && <div>Loading card data...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && currentCardData.length === 0 && (
          <div>No card data available.</div>
        )}
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
              <span className='px-3'>
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

      {/* Profile Search */}
      <input
        type='text'
        placeholder='Search First or Last Name or Aadhaar or Credit Card or Debit Card number...'
        className='border border-gray-300 rounded-md p-2 mb-4 w-full mt-8'
        value={profileSearchTerm}
        onChange={(e) => setProfileSearchTerm(e.target.value)}
      />

      {/* Profile Data Table */}
      <div>
        {loading && <div>Loading profile data...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && currentProfileData.length === 0 && (
          <div>No profile data available.</div>
        )}
        {!loading && !error && currentProfileData.length > 0 && (
          <div>
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
                  <th className='border border-gray-300 px-4 py-2'>Sex</th>
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
                  <th className='border border-gray-300 px-4 py-2'>
                    Debit Card Number
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Debit Card CVV
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Debit Card Expiry
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Debit Card Provider
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Driving License Number
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    License Issue Date
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    License Expiry Date
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    PAN Number
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    PAN Status
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Passport Number
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Passport Type
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Nationality
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Passport Issue Date
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Passport Expiry Date
                  </th>
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
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.debit_card_number}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.debit_card_cvv}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.debit_card_expiry}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.debit_card_provider}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.driving_licence_number}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.driving_licence_date_of_issue}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.driving_licence_date_of_expiry}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.pan_number}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.pan_status}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.passport_number}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.passport_type}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.nationality}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.passport_date_of_issue}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {profile.passport_date_of_expiry}
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
              <span className='px-3'>
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
