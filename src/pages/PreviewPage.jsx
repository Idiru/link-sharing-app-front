import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function PreviewPage() {
    const API_URL = "http://localhost:5005";

    const navigate = useNavigate();
    const { id } = useParams();

    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const { email, firstName, lastName, userName, profileImage } = result.user;
                setUserData({ email, firstName, lastName, userName, profileImage });
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

    return (
        <div>
            <div>
                <div>
                    <button onClick={() => navigate('/editor')}>Back To Editor</button>
                    <button>Share Link</button>
                </div>
            </div>
            <div>
                <div>
                    <img src={userData?.profileImage} alt="Profile" />
                    <h3>{userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}</h3>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default PreviewPage;
