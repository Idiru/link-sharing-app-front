import React, { useReducer, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pages/ProfilePage.css';
import Snackbar from "@mui/material/Snackbar";


function ProfilePage() {
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
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [open, setOpen] = useState(false); //To handle the display of the error message toast
    const [openSuccess, setopenSuccess] = useState(false); //To handle the display of the error message toast
    const [succesMessage, setsuccesMessage] = useState(undefined);

    const fileInputRef = useRef(null);
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleSuccess = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setopenSuccess(false);
    };
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/users/${id}`, {
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
            profileImage: state.profileImage
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/auth/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log("User updated successfully:", result);
                // Consider better ways to handle state update after successful update
                setsuccesMessage("All changes saved successfully.");
                setopenSuccess(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                const errorData = await response.json();
                console.error("Failed to update user:", errorData.message);
                setErrorMessage(errorData.message);
                return setOpen(true);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setErrorMessage(errorData.message);
            return setOpen(true);
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
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/user/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Cache-Control": "no-cache",
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                dispatch({
                    type: "input",
                    field: "profileImage",
                    value: result.profileImage,
                });
                console.log(result.profileImage);
            } else {
                const errorData = await response.json();
                console.error("Failed to upload image:", errorData.message);
                setErrorMessage("Failed to upload image");
                return setOpen(true);
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
                        <section
                            className="pic-container-right-image"
                            style={{
                                background: state.profileImage
                                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url("${state.profileImage}") center / cover no-repeat`
                                    : "", borderRadius: '10pxgit branch'
                            }}
                            onClick={handleClickUpload}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                            >
                                <path
                                    d="M33.75 6.25H6.25C5.58696 6.25 4.95107 6.51339 4.48223 6.98223C4.01339 7.45107 3.75 8.08696 3.75 8.75V31.25C3.75 31.913 4.01339 32.5489 4.48223 33.0178C4.95107 33.4866 5.58696 33.75 6.25 33.75H33.75C34.413 33.75 35.0489 33.4866 35.5178 33.0178C35.9866 32.5489 36.25 31.913 36.25 31.25V8.75C36.25 8.08696 35.9866 7.45107 35.5178 6.98223C35.0489 6.51339 34.413 6.25 33.75 6.25ZM33.75 8.75V24.8047L29.6766 20.7328C29.4444 20.5006 29.1688 20.3164 28.8654 20.1907C28.5621 20.0651 28.2369 20.0004 27.9086 20.0004C27.5802 20.0004 27.2551 20.0651 26.9518 20.1907C26.6484 20.3164 26.3728 20.5006 26.1406 20.7328L23.0156 23.8578L16.1406 16.9828C15.6718 16.5143 15.0362 16.2512 14.3734 16.2512C13.7107 16.2512 13.075 16.5143 12.6062 16.9828L6.25 23.3391V8.75H33.75ZM6.25 26.875L14.375 18.75L26.875 31.25H6.25V26.875ZM33.75 31.25H30.4109L24.7859 25.625L27.9109 22.5L33.75 28.3406V31.25ZM22.5 15.625C22.5 15.2542 22.61 14.8916 22.816 14.5833C23.022 14.275 23.3149 14.0346 23.6575 13.8927C24.0001 13.7508 24.3771 13.7137 24.7408 13.786C25.1045 13.8584 25.4386 14.037 25.7008 14.2992C25.963 14.5614 26.1416 14.8955 26.214 15.2592C26.2863 15.6229 26.2492 15.9999 26.1073 16.3425C25.9654 16.6851 25.725 16.978 25.4167 17.184C25.1084 17.39 24.7458 17.5 24.375 17.5C23.8777 17.5 23.4008 17.3025 23.0492 16.9508C22.6975 16.5992 22.5 16.1223 22.5 15.625Z"
                                    fill={state.profileImage ? "#FFF" : "#633CFF"}
                                />
                            </svg>
                            <h5 className={state.profileImage ? "uploaded" : ""}>
                                Upload image
                            </h5>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileUpload}
                            />
                        </section>
                        <label>
                            <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                        </label>
                    </div>
                </div>
                <div className="general-data-container">
                    <div className="input-container">
                        <label>User Name</label>
                        <input
                            placeholder="e.g.amazing_john"
                            name="userName"
                            value={state.userName || ""} // Ensure value is not undefined
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>First Name</label>
                        <input
                            placeholder="e.g.john"
                            name="firstName"
                            value={state.firstName || ""}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Last Name</label>
                        <input
                            placeholder="e.g. Appleseed"
                            name="lastName"
                            value={state.lastName || ""}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Email</label>
                        <input
                            placeholder="e.g. email@example.com"
                            name="email"
                            value={state.email || ""}
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
                            value={state.currentPassword || ""}
                            onChange={handleChange}
                            autoComplete="off"
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            value={state.newPassword || ""}
                            onChange={handleChange}
                            autoComplete="off"
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Confirm New Password</label>
                        <input
                            name="repeatedPassword"
                            type="password"
                            value={state.repeatedPassword || ""}
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
                <Snackbar
                    sx={{
                        ".css-1eqdgzv-MuiPaper-root-MuiSnackbarContent-root": {
                            backgroundColor: "#FF3939",
                        },
                    }}
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={errorMessage}
                    className="error-message"
                />
                <Snackbar
                    sx={{
                        ".css-1eqdgzv-MuiPaper-root-MuiSnackbarContent-root": {},
                    }}
                    open={openSuccess}
                    autoHideDuration={5000}
                    onClose={handleSuccess}
                    message={succesMessage}
                />
            </div>
        </>
    );
}

export default ProfilePage;
