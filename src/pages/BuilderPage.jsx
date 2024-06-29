import Navbar from "../components/Navbar";
import "../styles/pages/BuilderPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function BuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState([]);
  const token = localStorage.getItem("authToken");
  const isEmpty = () => {
    const deletedList = content.filter((item) => item.state == "deleted");
    return content.length == deletedList.length ? true : false
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  console.log("token:", token);
  console.log("userId:", userId);

  const navigate = useNavigate();

  const handleAddNewLink = () => {
    const newId = uuidv4();

    const newBlock = {
      block: "link",
      platform: "github",
      url: "",
      state: "new",
      uuid: newId,
    };
    setContent((prev) => [...prev, newBlock]);
    console.log(content);
  };

  const handleDropdownChange = (e, index) => {
    const newContent = content.map((item, idx) => {
      if (idx === index) {
        const newState = item.state !== "new" ? "updated" : "new";
        return { ...item, platform: e.target.value, state: newState };
      }
      return item;
    });
    setContent(newContent);
  };

  let handleRemoveLink = (_id) => {
    // Create a new array where the item with the matching _id is marked as "deleted"
    const newContent = content.map((item) => {
      if (item._id === _id) {
        console.log(`Marking item as deleted: ${_id}`);
        return { ...item, state: "deleted" };
      }
      return item;
    });
    // Update the state with the new array
    setContent(newContent);
    console.log("Deleted state added for _id:", _id, content);
  };

  const handleLinkChange = (e, index) => {
    const newContent = content.map((item, idx) => {
      if (idx === index) {
        const newState = item.state !== "new" ? "updated" : "new";
        return { ...item, url: e.target.value, state: newState };
      }
      console.log("Content updated:", content);
      return item;
    });
    setContent(newContent);
  };

  const handleLinkTitle = (e, index) => {
    const newContent = content.map((item, idx) => {
      if (idx === index) {
        const newState = item.state !== "new" ? "updated" : "new";
        return { ...item, title: e.target.value, state: newState };
      }
      return item;
    });
    setContent(newContent);
  };

  const handleSave = async () => {
    // Managing content creation, update and delete
    const toCreate = content.filter((item) => item.state === "new");
    const toUpdate = content.filter((item) => item.state === "updated");
    const toDelete = content.filter((item) => item.state == "deleted");
    console.log("to update:", toUpdate);

    // Use Promise.all to handle all requests simultaneously
    try {
      await Promise.all([
        ...toCreate.map((item) => {
          console.log("Saving item:", item);
          return axios
            .post(`${import.meta.env.VITE_BASE_URL}/content/create`, item, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              return { ...item, ...response.data, state: "created" };
            });
        }),
        ...toUpdate.map((item) =>
          axios.put(
            `${import.meta.env.VITE_BASE_URL}/content/${item._id}`,
            item,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          )
        ),
        ...toDelete.map((item) => {
          console.log("deleted items:", toDelete);
          axios.delete(`${import.meta.env.VITE_BASE_URL}/content/${item._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
        }),
      ]);

      //Remove deleted items from the state
      setContent((prev) =>
        prev
          .filter((item) => item.state !== "deleted")
          .map((item) => ({ ...item }))
      );

      console.log("All changes saved successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      axios.get(`${import.meta.env.VITE_BASE_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        console.log(res.data.user.content);
        setContent(res.data.user.content || []);
      })
      .catch((error) => {
        console.error("Error fetching user:", error.response ? error.response.data.message : "Network Error");
      })
      .finally(() => {
        setIsLoading(false); 
      });
    } else {
      console.error("No token found");
      setIsLoading(false);
    }
  }, [token, userId]); 

  return (
    <div className="builderpage-container">
      <Navbar />
      <div className="builderpage-content-container">
        <div className="builderpage-content-header-container">
          <h2>Customize your content</h2>
          <p>
            Add/edit/remove content below and then share all of them with the
            world!
          </p>
          <button
            className="builderpage-add-content-button secondary-button"
            onClick={handleAddNewLink}
          >
            + Add new link
          </button>
        </div>
        <div className="builderpage-content-builder-container">
          {
            isLoading ? (
              <div className="builderpage-content-get-started-container">
              <p>
               Loading...
              </p>
            </div>
            ) : (
              isEmpty() ? (
            <div className="builderpage-content-get-started-container">
              <img src="./svg/get-started.svg" alt="get started" />
              <h2>Let’s get you started</h2>
              <p>
                Use the “Add new link” button to get started. Once you have more
                than one link, you can reorder and edit them. We’re here to help
                you share your profiles with everyone!
              </p>
            </div>
          ) : (
            content.map((item, index) =>
              item.state !== "deleted" ? (
                <div
                  className="builderpage-content-block-container"
                  key={index}
                >
                  <div className="builderpage-content-block-header">
                    <p className="builderpage-content-block-label">
                      <b>Link #{index + 1}</b>
                    </p>
                    <p
                      className="builderpage-content-block-remove"
                      onClick={() => handleRemoveLink(item._id)}
                    >
                      Remove
                    </p>
                  </div>
                  <div className="builderpage-content-block-content">
                    <div className="builderpage-content-select-container">
                      <label>Platform</label>
                      <div className="builderpage-content-select-container-image">
                        {item.platform ? (
                          <img
                            src={`/svg/${item.platform}-grey-logo.svg`}
                            alt="logo-platform"
                            className="builderpage-content-select-container-logo"
                          />
                        ) : (
                          ""
                        )}
                        <select
                          className="builderpage-select"
                          onChange={(e) => handleDropdownChange(e, index)}
                          name="platform"
                          value={item.platform}
                        >
                          <option value="github">Github</option>
                          <option value="youtube">Youtube</option>
                          <option value="linkedin">Linkedin</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitch">Twitch</option>
                        </select>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="9"
                          viewBox="0 0 14 9"
                          fill="none"
                          className="builderpage-content-block-arrow"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="#633CFF"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="builderpage-input-container">
                    <div className="builderpage-input-container-content">
                      <label>Title*</label>
                      <div className="builderpage-input-container-image">
                        <input
                          type="url"
                          placeholder="Github"
                          name="url"
                          className="builderpage-input input-title"
                          value={item.title}
                          onChange={(e) => handleLinkTitle(e, index)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="builderpage-input-container">
                    <div className="builderpage-input-container-content">
                      <label>Link*</label>
                      <div className="builderpage-input-container-image">
                        <img
                          className="builderpage-link-svg"
                          src="/svg/link-grey-logo.svg"
                          alt="link-icon"
                        />
                        <input
                          type="url"
                          placeholder="https://github.com/Idiru"
                          name="url"
                          className="builderpage-input"
                          value={item.url}
                          onChange={(e) => handleLinkChange(e, index)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )
          ))
          }
        </div>
        <div className="builderpage-action-container">
          <button
            className="secondary-button"
            onClick={() => navigate(`${userId}/preview`)}
          >
            Preview
          </button>
          <button className="primary-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuilderPage;