import '../styles/pages/UpdateUserPage.css'
import { useNavigate } from 'react-router-dom'
import { useReducer } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'
function UpdateUserPage() {
    const navigate = useNavigate()
    const { id } = useParams();
    console.log(id)  // id is being printed indeed
    const fetchUserData = async () => {
        try {
            const response = await fetch(`/auth/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`


                }

            });

            if (response.ok) {
                const result = await response.json();
                const { email, firstName, lastName, userName } = result.user;
                return { email, firstName, lastName, userName, currentPassword: '', newPassword: '', repeatedPassword: '' };
            } else {
                console.error('Failed to fetch user data');
                return initState;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            return initState;
        }
    };
    const initState = {
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        repeatedPassword: ''
    }
    const reducer = (state, action) => {
        if (action.type == 'input') {
            return { ...state, [action.field]: [action.value] }
        }
        else if (action.type == 'setUserData')
            return { ...state, ...action.payload };

    }
    const [state, dispatch] = useReducer(reducer, initState)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initializeUserData = async () => {
            const userData = await fetchUserData();
            dispatch({ type: 'setUserData', payload: userData });
            setLoading(false);
        };
        initializeUserData();
    }, []);

    const handleChange = (e) => {
        e.preventDefault()
        dispatch({
            type: 'input',
            field: e.target.name,
            value: e.target.value
        })
    }
    const saveData = (e) => {
        e.preventDefault()
    }
    const cancelChanges = (e) => {
        e.preventDefault()
        navigate('/links') // for the moment
    }
    return (
        <>
            <Navbar />
            <div className="update-info-container">
                <h1 className="profile-details-header">Profile Details</h1>
                <div className="pic-container">
                    <p className="profile-pic-text">Profile picture</p>
                    <div className="pic-container-right">
                        <section>
                            <div>
                                <img src="../src/assets/Images/ph_image.svg" />
                            </div>
                            <h5>upload image</h5>
                        </section>
                        <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                    </div>
                </div>
                <div className="general-data-container">
                    <div className="input-container">
                        <label>User Name</label>
                        <input
                            placeholder="e.g.amazing_john"
                            name="userName"
                            value={state.userName}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>First Name</label>
                        <input
                            placeholder="e.g.john"
                            name="firstName"
                            value={state.firstName}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Last Name</label>
                        <input
                            placeholder="e.g. Appleseed"
                            name="lastName"
                            value={state.lastName}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Email</label>
                        <input
                            placeholder="e.g. email@example.com"
                            name="email"
                            value={state.email}
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
                            value={state.currentPassword}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>New Password</label>
                        <input
                            name=" newPassword"
                            type="password"
                            value={state.newPassword}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="input-container">
                        <label>Confirm New Password</label>
                        <input
                            name="repeatedPassword"
                            type="password"
                            value={state.repeatedPassword}
                            onChange={handleChange}
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
