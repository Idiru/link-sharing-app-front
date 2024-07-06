import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../styles/pages/PreviewPage.css';
import 'remixicon/fonts/remixicon.css';

function VisitorsPage() {
  const inputRef = useRef(null); // ref for the input field

  // important social media 
  const platforms = [
    { platform: 'youtube', color: 'red', icon: 'ri-youtube-fill' },
    { platform: 'github', color: 'black', icon: 'ri-github-fill' },
    { platform: 'instagram', color: '#E1306C', icon: 'ri-instagram-fill' },
    { platform: 'facebook', color: '#1877F2', icon: 'ri-facebook-fill' },
    { platform: 'twitter', color: '#1DA1F2', icon: 'ri-twitter-fill' },
    { platform: 'linkedin', color: '#0077B5', icon: 'ri-linkedin-fill' },
    { platform: 'other', color: 'grey', icon: 'ri-link' },
  ];

  const navigate = useNavigate();
  const { userName } = useParams();

  const [userData, setUserData] = useState(null);
  const [userContent, setUserContent] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/devlinks/${userName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const { firstName, lastName, userName, profileImage, content } = result;
        console.log(result);
        setUserData({ firstName, lastName, userName, profileImage });
        setUserContent(content);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRedirection = async (contentId, url) => {
    try {
      // Fetch visitor's IP address
      const ipResponse = await fetch('https://api64.ipify.org?format=json');
      if (!ipResponse.ok) {
        throw new Error('Failed to fetch IP address');
      }
      const { ip } = await ipResponse.json();

      // Fetch visitor's country based on IP address
      const countryResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!countryResponse.ok) {
        throw new Error('Failed to fetch country');
      }
      const { country } = await countryResponse.json();
      console.log('Visitor Country:', country);

      // Send POST request to record the click and store country
      const clickResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/clicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ contentId, country })
      });

      if (clickResponse.ok) {
        console.log('Click recorded and country stored');
      } else {
        console.error('Failed to record click and store country');
      }

      // Redirect to the URL
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error handling click:', error);
    }
  };

  return (
    <div style={{ background: 'var(--Light-Grey, #FAFAFA)' }}>
      <div className='upper-container'></div>
      <div>
        <div className='info-container'>
          <div className='img-name'>
            <img src={userData?.profileImage} alt="Profile" />
            <h3>
              {userData ? (
                userData.firstName && userData.lastName ?
                  `${userData.firstName} ${userData.lastName}` :
                  userData.userName
              ) : 'Loading...'}
            </h3>           </div>
          <div className='content-container'>
            {userContent && userContent.length > 0 ? (

              userContent.map((content) => {
                const platformData = platforms.find(p => p.platform === content.platform?.toLowerCase());
                return (

                  < div key={content._id}
                    onClick={() => handleRedirection(content._id, content.url)}

                    className='content-item'
                    style={{ backgroundColor: platformData ? platformData.color : 'grey' }}
                  >
                    {platformData && <i className={platformData.icon} style={{ color: 'white' }} />}
                    <h4>{content.title}</h4>
                    <i className="ri-arrow-right-line" style={{ color: 'white' }}></i>
                  </div>
                );
              })
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}

export default VisitorsPage;
