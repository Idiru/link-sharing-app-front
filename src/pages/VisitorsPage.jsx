import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/pages/PreviewPage.css";
import "remixicon/fonts/remixicon.css";
import { jwtDecode } from "jwt-decode";

function VisitorsPage() {
  const inputRef = useRef(null); // ref for the input field

  // important social media
  const platforms = [
    { platform: "youtube", color: "#EE3939", icon: "ri-youtube-fill" },
    { platform: "github", color: "#1A1A1A", icon: "ri-github-fill" },
    { platform: 'other', color: '#737373', icon: 'ri-instagram-fill' },
    { platform: "facebook", color: "#2442AC", icon: "ri-facebook-fill" },
    { platform: "twitter", color: "#43B7E9", icon: "ri-twitter-fill" },
    { platform: "linkedin", color: "#2D68FF", icon: "ri-linkedin-fill" },
    { platform: "twitch", color: "#EE3FC8", icon: "ri-link" },
  ];

  const navigate = useNavigate();
  const { userName } = useParams();
  const token = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const id = decodedToken._id;

  const [userData, setUserData] = useState(null);
  const [userContent, setUserContent] = useState([]);

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
        const { firstName, lastName, userName, profileImage } = result.user;
        console.log(result.user);
        setUserData({ firstName, lastName, userName, profileImage });
        console.log(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserContent = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/content/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const newList = result.filter((item) => item.isPublished === true)
        setUserContent(newList);
      } else {
        console.error("Failed to fetch user content");
      }
    } catch (error) {
      console.error("Error fetching user content:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserContent();
  }, []);

  const handleRedirection = (url) => {
    window.location.href = url;
  };

  return (
    <div className="preview-page-container">
      <div className="upper-container visitor-upper"></div>
      <div>
        <div className="info-container">
          <div
            className="img-name"
            style={{ backgroundImage: `url(${userData?.profileImage})` }}
          >
            {" "}
          </div>
          <h3>
            {userData
              ? userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : userData.userName
              : "Loading..."}
          </h3>
          <div className="content-container">
            {userContent && userContent.length > 0 ? (
              userContent.map((content) => {
                const platformData = platforms.find(
                  (p) => p.platform === content.platform.toLowerCase()
                );
                return (
                  <div
                    onClick={() => handleRedirection(content.url)}
                    key={content._id}
                    className="content-item"
                    style={{
                      backgroundColor: platformData
                        ? platformData.color
                        : "grey",
                    }}
                  >
                    {platformData && (
                      <img
                        src={`/svg/${platformData.platform}-white-logo.svg`}
                        alt="logo"
                      />
                    )}
                    <h4>{content.title}</h4>

                    <i
                      className="ri-arrow-right-line "
                      style={{ color: "white" }}
                    ></i>
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
