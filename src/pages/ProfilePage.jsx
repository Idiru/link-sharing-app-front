import "../styles/pages/UpdateUserPage.css";
import { useNavigate } from "react-router-dom";
import { useReducer, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Snackbar from "@mui/material/Snackbar";

function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const { email, firstName, lastName, userName } = result.user;
        return {
          email,
          firstName,
          lastName,
          userName,
          currentPassword: "",
          newPassword: "",
          repeatedPassword: "",
          profileImage: result.user.profileImage,
        };
      } else {
        console.error("Failed to fetch user data");
        return initState;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return initState;
    }
  };

  //To open/close the error message when the user click away
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const initState = {
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    repeatedPassword: "",
    profileImage: null,
  };

  const reducer = (state, action) => {
    if (action.type === "input") {
      return { ...state, [action.field]: action.value };
    } else if (action.type === "setUserData") {
      return { ...state, ...action.payload };
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("Choose File");
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [open, setOpen] = useState(false); //To handle the display of the error message toast

  useEffect(() => {
    const initializeUserData = async () => {
      const userData = await fetchUserData();
      dispatch({ type: "setUserData", payload: userData });
      setProfileImageUrl(userData.profileImage); // Set profile image URL if it exists
      setLoading(false);
    };
    initializeUserData();
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: "input",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);

    // Read selected file and set profile image URL for preview
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImageUrl(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const saveData = async (e) => {
    const {
      email,
      firstName,
      lastName,
      userName,
      currentPassword,
      newPassword,
      repeatedPassword,
    } = state;

    if (newPassword !== repeatedPassword) {
      setErrorMessage("New passwords do not match.");
      return setOpen(true);
    }

    const data = new FormData();
    data.append("profileImage", file);
    data.append("email", email);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("userName", userName);
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("User updated successfully:", result);
        if (result.user.profileImage) {
          setProfileImageUrl(result.user.profileImage);
        }
        window.location.reload();
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

  const cancelChanges = (e) => {
    navigate("/");
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
              <div>
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" />
                ) : (
                  <img
                    src="../src/assets/Images/ph_image.svg"
                    alt="Placeholder"
                  />
                )}
              </div>
              <h5>Upload image</h5>
            </section>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              required
            />
            <label>
              <p>Image must be below 1024x1024px. Use PNG or JPG format.</p>
            </label>
          </div>
        </div>
        <div className="general-data-container">
          <div className="input-container">
            <label>User Name*</label>
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
            <label>Email*</label>
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
              autoComplete="off"
            ></input>
          </div>
          <div className="input-container">
            <label>New Password</label>
            <input
              name="newPassword"
              type="password"
              value={state.newPassword}
              onChange={handleChange}
              autoComplete="off"
            ></input>
          </div>
          <div className="input-container">
            <label>Confirm New Password</label>
            <input
              name="repeatedPassword"
              type="password"
              value={state.repeatedPassword}
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
      </div>
    </>
  );
}

export default ProfilePage;
