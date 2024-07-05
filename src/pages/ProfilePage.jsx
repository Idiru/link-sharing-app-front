import React, { useReducer, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/ProfilePage.css';

function UpdateUserPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const initState = {
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        repeatedPassword: '',
        profileImage: null
    };

    const reducer = (state, action) => {
        if (action.type === 'input') {
            return { ...state, [action.field]: action.value };
        } else if (action.type === 'setUserData') {
            return { ...state, ...action.payload };
        }
    };

    const [state, dispatch] = useReducer(reducer, initState);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5005/auth/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const { email, firstName, lastName, userName } = result.user;
                return { email, firstName, lastName, userName, currentPassword: '', newPassword: '', repeatedPassword: '', profileImage: result.user.profileImage };
            } else {
                console.error('Failed to fetch user data');
                return initState;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return initState;
        }
    };

    useEffect(() => {
        const initializeUserData = async () => {
            const userData = await fetchUserData();
            dispatch({ type: 'setUserData', payload: userData });
            setLoading(false);
        };
        initializeUserData();
    }, []);

    const handleChange = (e) => {
        dispatch({
            type: 'input',
            field: e.target.name,
            value: e.target.value
        });
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const saveData = async () => {
        const { email, firstName, lastName, userName, currentPassword, newPassword, repeatedPassword } = state;

        if (newPassword !== repeatedPassword) {
            alert("New passwords do not match.");
            return;
        }

        const data = {
            email,
            firstName,
            lastName,
            userName,
            currentPassword,
            newPassword,
            profileImage: state.profileImage // Ensure to properly handle profile image data
        };

        try {
            const response = await fetch(`http://localhost:5005/auth/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("User updated successfully:", result);
                window.location.reload(); // Consider better ways to handle state update after successful update
            } else {
                const errorData = await response.json();
                console.error("Failed to update user:", errorData.message);
                alert("Failed to update user: " + errorData.message);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user");
        }
    };

    const cancelChanges = () => {
        navigate("/");
    };

    // Check if data is still loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // image uploading  
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await fetch('http://localhost:5005/user/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                dispatch({ type: 'input', field: 'profileImage', value: result.profileImage });
                console.log(result.profileImage)
            } else {
                const errorData = await response.json();
                console.error('Failed to upload image:', errorData.message);
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        }
    };


    return (
        <>
            <Navbar />
            <div className="update-info-container">
                <h1 className="profile-details-header">Profile Details</h1>
                <div className="pic-container">
                    <p className="profile-pic-text">Profile picture</p>
                    <div className="pic-container-right">
                        <section onClick={handleClickUpload}>
                            <img src={state.profileImage} alt="Profile" className="profile-image" />
                            <h5>Upload image</h5>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                        </section>
                        <label><p>Image must be below 1024x1024px. Use PNG or JPG format.</p></label>
                    </div>
                </div>
                <div className="general-data-container">
                    <div className="input-container">
                        <label>User Name</label>
                        <input
                            placeholder="e.g.amazing_john"
                            name="userName"
                            value={state.userName || ''} // Ensure value is not undefined
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>First Name</label>
                        <input
                            placeholder="e.g.john"
                            name="firstName"
                            value={state.firstName || ''}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Last Name</label>
                        <input
                            placeholder="e.g. Appleseed"
                            name="lastName"
                            value={state.lastName || ''}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Email</label>
                        <input
                            placeholder="e.g. email@example.com"
                            name="email"
                            value={state.email || ''}
                            onChange={handleChange}
                        ></input>
                    </div>
                </div>
                <div className="general-data-container">
                    <div className="input-container">
                        <label>Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            value={state.currentPassword || ''}
                            onChange={handleChange}
                            autoComplete="off"
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            value={state.newPassword || ''}
                            onChange={handleChange}
                            autoComplete="off"
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Confirm New Password</label>
                        <input
                            name="repeatedPassword"
                            type="password"
                            value={state.repeatedPassword || ''}
                            onChange={handleChange}
                            autoComplete="off"
                        ></input>
                    </div>
                </div>
                <div className="update-btn">
                    <button className="save-btn" onClick={saveData}>
                        <p>Save</p>
                    </button>
                    <button className="cancel-btn" onClick={cancelChanges}>
                        <p>Cancel</p>
                    </button>
                </div>
            </div>
        </>
    );
}

export default UpdateUserPage;
