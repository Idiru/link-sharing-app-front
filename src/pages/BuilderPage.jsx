import Navbar from "../components/Navbar";
import "../styles/pages/BuilderPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

function BuilderPage() {
  const [isLoading, setIsLoading] = useState(false); //Display the loading screen waiting for the data
  const [content, setContent] = useState([]); //Main variable to store the whole content from the user
  const [succesMessage, setsuccesMessage] = useState(undefined);
  const [open, setOpen] = useState(false); //To handle the display of the error message toast
  const token = localStorage.getItem("authToken");
  const isEmpty = () => {
    //Check if the list is empty
    const deletedList = content.filter((item) => item.state == "deleted"); //Filter the content to have only deleted content
    return content.length == deletedList.length ? true : false; //If the length of the deleted content list is the same than the content one
  };

  //Get the user id from the token to target it inside our api calls
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;

  //To navigate
  const navigate = useNavigate();

  //To open/close the error message when the user click away
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //Function to add a new link inside the builder
  const handleAddNewLink = () => {
    const newId = uuidv4(); //Just created it in case we need it later, maybe not needed

    //Define a new content with the default and empties stuff
    const newBlock = {
      block: "link",
      platform: "github",
      url: "",
      state: "new",
      uuid: newId,
    };
    setContent((prev) => [...prev, newBlock]);
  };

  //Handle content modification

  //Handle change inside the input list fields
  const handleDropdownChange = (e, index) => {
    const newContent = content.map((item, idx) => {
      if (idx === index) {
        const newState = item.state !== "new" ? "updated" : "new"; //Condition to avoid to define it as "updated" a brand new content which is not yet created inside the DB (cause the state "updated" will make a PUT request on something which does not exist yet)
        return { ...item, platform: e.target.value, state: newState }; //Modifing the content with the new data
      }
      return item;
    });
    setContent(newContent); //Set the content list with the items modificated
  };

  //Handle change inside the link input fields
  const handleLinkChange = (e, index) => {
    const newContent = content.map((item, idx) => {
      if (idx === index) {
        const newState = item.state !== "new" ? "updated" : "new";
        return { ...item, url: e.target.value, state: newState };
      }
      return item;
    });
    setContent(newContent);
  };

  //Handle change inside the title inputfields
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

  //Handle removed content inside the list of content
  let handleRemoveLink = (_id) => {
    //We get the id when you click on a specific content inside the HTML
    // Create a new array where the item with the matching _id is marked as "deleted"
    const newContent = content.map((item) => {
      if (item._id === _id) {
        return { ...item, state: "deleted" };
      }
      return item;
    });
    // Update the state with the new array
    setContent(newContent);
  };

  //One function to manage all interactions with the back-end, thanks to a Save button
  const handleSave = async () => {
    // Creating new lists focus on content states new, updated and deleted
    const toCreate = content.filter((item) => item.state === "new");
    const toUpdate = content.filter((item) => item.state === "updated");
    const toDelete = content.filter((item) => item.state == "deleted");

    // A promise to handle the 3 kinds of requests, we iterate on each item of the focused list to do a request for each one
    try {
      await Promise.all([
        // To create a content
        ...toCreate.map((item) => {
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
        // To update a content
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
        // To delete a content
        ...toDelete.map((item) => {
          axios.delete(`${import.meta.env.VITE_BASE_URL}/content/${item._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
        }),
      ]);

      //Then we need to remove deleted items from the content state
      setContent((prev) =>
        prev
          .filter((item) => item.state !== "deleted")
          .map((item) => ({ ...item }))
      );

      console.log("All changes saved successfully.");
      setsuccesMessage("All changes saved successfully.");
      setOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true); //To start the loading screen
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/auth/users/${userId}`, {
          //To get the current content a the user and to fill the builder
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        })
        .then((res) => {
          setContent(res.data.user.content || []);
        })
        .catch((error) => {
          console.error(
            "Error fetching user:",
            error.response ? error.response.data.message : "Network Error"
          );
        })
        .finally(() => {
          setIsLoading(false); //To stop the loading screen
        });
    } else {
      console.error("No token found");
      setIsLoading(false);
    }
    
  }, [token, userId]);

  useEffect(() => {
    // Define the padding for the phone preview
    const nonDeletedBlocks = content.filter(item => item.state !== "deleted");
    const padding = nonDeletedBlocks.length > 4 ? `${(nonDeletedBlocks.length * 15) * 1.5}px` : "20px";

    const container = document.querySelector(".builderpage-preview-phone-blocks-container");
    if (container) {
        container.style.transition = 'padding-top 0.3s ease-out';
        container.style.paddingTop = padding;
    }
  }, [content]);  


  return (
    <div className="builderpage-container">
      <Navbar />
      <div className="builderpage-content-container">
        <div className="builderpage-preview-container">
          <div className="builderpage-preview-phone-container">
            <div className="builderpage-preview-phone-blocks-container">
              {content.map((item) =>
                item.state !== "deleted" ? (
                  <div className={`block ${item.platform}`}>
                    <img
                      src={`./svg/${item.platform}-white-logo.svg`}
                      alt="logo"
                    />
                    <p>{item.title}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M0.666626 5.3333V6.66664H8.66663L4.99996 10.3333L5.94663 11.28L11.2266 5.99997L5.94663 0.719971L4.99996 1.66664L8.66663 5.3333H0.666626Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        </div>
        <div className="builderpage-builder-container">
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
            {isLoading ? (
              <div className="builderpage-content-get-started-container">
                <p>Loading...</p>
              </div>
            ) : isEmpty() ? (
              <div className="builderpage-content-get-started-container">
                <img src="./svg/get-started.svg" alt="get started" />
                <h2>Let’s get you started</h2>
                <p>
                  Use the “Add new link” button to get started. Once you have
                  more than one link, you can reorder and edit them. We’re here
                  to help you share your profiles with everyone!
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
            )}
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
      <Snackbar
        sx={{
          ".css-1eqdgzv-MuiPaper-root-MuiSnackbarContent-root": {
          },
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={succesMessage}
      />
    </div>
  );
}

export default BuilderPage;
