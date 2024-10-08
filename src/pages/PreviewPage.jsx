import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/pages/PreviewPage.css";
import "remixicon/fonts/remixicon.css";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { fetchUserData } from "../utils/fetchUserData";

Modal.setAppElement("#root");

function PreviewPage() {
  const inputRef = useRef(null); // ref for the input field

  // important social media
  const platforms = [
    { platform: "youtube", color: "red", icon: "ri-youtube-fill" },
    { platform: "github", color: "black", icon: "ri-github-fill" },
    { platform: "instagram", color: "#E1306C", icon: "ri-instagram-fill" },
    { platform: "facebook", color: "#1877F2", icon: "ri-facebook-fill" },
    { platform: "twitter", color: "#1DA1F2", icon: "ri-twitter-fill" },
    { platform: "linkedin", color: "#0077B5", icon: "ri-linkedin-fill" },
    { platform: "other", color: "grey", icon: "ri-link" },
  ];
  const navigate = useNavigate();
  const navigateToPerformance = useNavigate();
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

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
        setUserContent(result);
      } else {
        console.error("Failed to fetch user content");
      }
    } catch (error) {
      console.error("Error fetching user content:", error);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(id);
      if (data) {
        setUserData(data);
      }
    };
    getUserData();
    fetchUserContent();
  }, []);

  const handleRedirection = (url) => {
    window.open(url, "_blank");
  };
  const handleShareLink = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/content/users/${id}/publish`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Content published successfully");
        console.log(result);
        setShareLink(
          `${import.meta.env.VITE_BASE_URL_FRONT}/devlinks/${userData.userName}`
        );
        setModalIsOpen(true);
      } else {
        console.error("Failed to publish content");
      }
    } catch (error) {
      console.error("Error publishing content:", error);
    }
  };
  const handleAnalytics = (contentId) => {
    const analyticsUrl = `${
      import.meta.env.VITE_BASE_URL_FRONT
    }/performance/${contentId}`;
    window.open(analyticsUrl, "_blank");
  };
  // COPYING THE LICK FROM INPUT FIELD HANDLER
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div style={{ background: "var(--Light-Grey, #FAFAFA)" }}>
      <div className="upper-container">
        <div className="btn-container">
          <button className="back-btn" onClick={() => navigate(`/`)}>
            <Link to={`${import.meta.env.VITE_BASE_URL}/`} />
            <p>Back To Editor</p>
          </button>
          <button className="share-btn" onClick={handleShareLink}>
            <p>Publish</p>
          </button>
        </div>
      </div>
      <div>
        <div className="info-container">
          <div className="img-name">
            <img src={userData?.profileImage} alt="Profile" />
            <h3>
              {userData
                ? userData.firstName && userData.lastName
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData.userName
                : "Loading..."}
            </h3>{" "}
          </div>
          <div className="content-container">
            {userContent && userContent.length > 0 ? (
              userContent.map((content) => {
                const platformData = platforms.find(
                  (p) => p.platform === content.platform.toLowerCase()
                );
                return (
                  <div
                    className="content-item"
                    style={{
                      backgroundColor: platformData
                        ? platformData.color
                        : "grey",
                    }}
                  >
                    {platformData && (
                      <i
                        className={platformData.icon}
                        style={{ color: "white" }}
                      />
                    )}
                    <h4>{content.title}</h4>
                    <div>
                      <i
                        className="ri-bar-chart-2-line"
                        style={{ color: "white" }}
                        onClick={() => handleAnalytics(content._id)}
                        key={content._id}
                      ></i>
                      <i
                        className="ri-arrow-right-line"
                        style={{ color: "white", paddingLeft: "5px" }}
                        onClick={() => handleRedirection(content.url)}
                        key={content._id}
                      ></i>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Share Link Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Share Your Link</h2>
        <div className="copy-input">
          <input type="text" value={shareLink} ref={inputRef} readOnly />
          <span onClick={copyToClipboard}>
            <i className="ri-links-line"></i>
          </span>
        </div>
      </Modal>
    </div>
  );
}

export default PreviewPage;
