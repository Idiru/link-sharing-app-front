import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import "../styles/components/Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setuserData] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Récupération du token du localStorage
    if (token) {
      axios.get(`${import.meta.env.VITE_BASE_URL}/user/username`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        setuserData(res.data)
      })
      .catch(error => {
        const errorDescription = error.res ? error.res.data.message : 'Network Error';
        console.error('Error fetching user:', errorDescription);
      });
    }
  }, []);

  const navigate = useNavigate();

  return (
    <Box
      className="navbar-test"
      sx={{
        flexGrow: 1,
        ".css-hip9hq-MuiPaper-root-MuiAppBar-root": {
          borderRadius: "12px",
          boxShadow: "none",
        },
        "@media screen and (min-width: 768px)": {
          padding: "24px",
        },
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div
              className="navbar-logo-container"
              onClick={() => navigate("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.7735 34.2252C8.21683 36.6668 12.1435 36.6668 20.0002 36.6668C27.8568 36.6668 31.7852 36.6668 34.2252 34.2252C36.6668 31.7868 36.6668 27.8568 36.6668 20.0002C36.6668 12.1435 36.6668 8.21516 34.2252 5.7735C31.7868 3.3335 27.8568 3.3335 20.0002 3.3335C12.1435 3.3335 8.21516 3.3335 5.7735 5.7735C3.3335 8.21683 3.3335 12.1435 3.3335 20.0002C3.3335 27.8568 3.3335 31.7852 5.7735 34.2252ZM15.8335 14.5835C14.7622 14.5835 13.7149 14.9012 12.8242 15.4964C11.9334 16.0916 11.2391 16.9375 10.8291 17.9273C10.4192 18.9171 10.3119 20.0062 10.5209 21.0569C10.7299 22.1076 11.2458 23.0728 12.0033 23.8303C12.7609 24.5879 13.726 25.1037 14.7768 25.3127C15.8275 25.5218 16.9166 25.4145 17.9064 25.0045C18.8961 24.5945 19.7421 23.9003 20.3373 23.0095C20.9325 22.1187 21.2502 21.0715 21.2502 20.0002C21.2502 19.6686 21.3819 19.3507 21.6163 19.1163C21.8507 18.8819 22.1686 18.7502 22.5002 18.7502C22.8317 18.7502 23.1496 18.8819 23.384 19.1163C23.6185 19.3507 23.7502 19.6686 23.7502 20.0002C23.7502 21.5659 23.2859 23.0965 22.416 24.3984C21.5461 25.7003 20.3097 26.715 18.8631 27.3142C17.4165 27.9134 15.8247 28.0702 14.289 27.7647C12.7533 27.4592 11.3427 26.7053 10.2356 25.5981C9.1284 24.4909 8.37441 23.0803 8.06895 21.5446C7.76348 20.0089 7.92026 18.4172 8.51945 16.9706C9.11864 15.524 10.1333 14.2876 11.4352 13.4177C12.7371 12.5478 14.2677 12.0835 15.8335 12.0835C16.165 12.0835 16.483 12.2152 16.7174 12.4496C16.9518 12.684 17.0835 13.002 17.0835 13.3335C17.0835 13.665 16.9518 13.983 16.7174 14.2174C16.483 14.4518 16.165 14.5835 15.8335 14.5835ZM29.5835 20.0002C29.5835 21.4368 29.0128 22.8145 27.997 23.8303C26.9812 24.8461 25.6034 25.4168 24.1668 25.4168C23.8353 25.4168 23.5174 25.5485 23.2829 25.7829C23.0485 26.0174 22.9168 26.3353 22.9168 26.6668C22.9168 26.9984 23.0485 27.3163 23.2829 27.5507C23.5174 27.7851 23.8353 27.9168 24.1668 27.9168C25.7326 27.9168 27.2632 27.4525 28.5651 26.5826C29.867 25.7127 30.8817 24.4763 31.4809 23.0297C32.0801 21.5832 32.2368 19.9914 31.9314 18.4557C31.6259 16.92 30.8719 15.5094 29.7648 14.4022C28.6576 13.2951 27.247 12.5411 25.7113 12.2356C24.1756 11.9301 22.5838 12.0869 21.1373 12.6861C19.6907 13.2853 18.4543 14.3 17.5844 15.6019C16.7145 16.9038 16.2502 18.4344 16.2502 20.0002C16.2502 20.3317 16.3819 20.6496 16.6163 20.884C16.8507 21.1185 17.1686 21.2502 17.5002 21.2502C17.8317 21.2502 18.1496 21.1185 18.384 20.884C18.6185 20.6496 18.7502 20.3317 18.7502 20.0002C18.7502 18.5636 19.3208 17.1858 20.3367 16.17C21.3525 15.1542 22.7302 14.5835 24.1668 14.5835C25.6034 14.5835 26.9812 15.1542 27.997 16.17C29.0128 17.1858 29.5835 18.5636 29.5835 20.0002Z"
                  fill="#633CFF"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="108"
                height="21"
                viewBox="0 0 136 27"
                fill="none"
                className="logo-typo"
              >
                <path
                  d="M14.2472 26.15V22.195L14.5935 22.265C14.3626 23.5483 13.6701 24.575 12.5158 25.345C11.3846 26.115 10.0226 26.5 8.42974 26.5C6.81378 26.5 5.40559 26.1267 4.20516 25.38C3.02782 24.61 2.11596 23.5367 1.46957 22.16C0.823191 20.7833 0.5 19.1617 0.5 17.295C0.5 15.405 0.834734 13.76 1.5042 12.36C2.17367 10.96 3.10862 9.875 4.30904 9.105C5.53255 8.335 6.95229 7.95 8.56824 7.95C10.2535 7.95 11.6155 8.34666 12.6543 9.14C13.7162 9.93333 14.3395 11.0183 14.5242 12.395L14.1433 12.43V0.949999H19.3375V26.15H14.2472ZM10.0919 22.3C11.3154 22.3 12.308 21.8683 13.0698 21.005C13.8317 20.1183 14.2126 18.8583 14.2126 17.225C14.2126 15.5917 13.8201 14.3433 13.0352 13.48C12.2734 12.5933 11.2692 12.15 10.0226 12.15C8.82218 12.15 7.82952 12.5933 7.04463 13.48C6.28282 14.3667 5.90192 15.6267 5.90192 17.26C5.90192 18.8933 6.28282 20.1417 7.04463 21.005C7.82952 21.8683 8.84527 22.3 10.0919 22.3Z"
                  fill="#333333"
                />
                <path
                  d="M31.801 26.5C29.8387 26.5 28.1304 26.115 26.6761 25.345C25.2217 24.5517 24.0905 23.455 23.2826 22.055C22.4977 20.655 22.1052 19.045 22.1052 17.225C22.1052 15.3817 22.4977 13.7717 23.2826 12.395C24.0905 10.995 25.2102 9.91 26.6415 9.14C28.0727 8.34666 29.7349 7.95 31.6278 7.95C33.4516 7.95 35.0329 8.32333 36.3718 9.07C37.7108 9.81667 38.7496 10.855 39.4883 12.185C40.227 13.515 40.5964 15.0783 40.5964 16.875C40.5964 17.2483 40.5849 17.5983 40.5618 17.925C40.5387 18.2283 40.5041 18.52 40.4579 18.8H25.1525V15.335H36.2679L35.3676 15.965C35.3676 14.5183 35.0213 13.4567 34.3288 12.78C33.6593 12.08 32.7359 11.73 31.5586 11.73C30.1966 11.73 29.1346 12.1967 28.3728 13.13C27.6341 14.0633 27.2647 15.4633 27.2647 17.33C27.2647 19.15 27.6341 20.5033 28.3728 21.39C29.1346 22.2767 30.2658 22.72 31.7663 22.72C32.5974 22.72 33.313 22.58 33.9133 22.3C34.5135 22.02 34.9636 21.565 35.2637 20.935H40.1462C39.5691 22.6617 38.5765 24.0267 37.1683 25.03C35.7832 26.01 33.9941 26.5 31.801 26.5Z"
                  fill="#333333"
                />
                <path
                  d="M47.6802 26.15L40.72 8.3H46.2951L51.7316 24.96H48.8229L54.2248 8.3H59.6614L52.7012 26.15H47.6802Z"
                  fill="#333333"
                />
                <path
                  d="M61.6687 26.15V0.949999H66.8628V26.15H61.6687Z"
                  fill="#333333"
                />
                <path
                  d="M71.0019 26.15V8.3H76.1961V26.15H71.0019ZM70.8288 5.92V0.25H76.3692V5.92H70.8288Z"
                  fill="#333333"
                />
                <path
                  d="M80.3352 26.15V8.3H85.4254V12.5H85.5293V26.15H80.3352ZM92.628 26.15V15.09C92.628 14.11 92.374 13.375 91.8662 12.885C91.3814 12.395 90.6657 12.15 89.7193 12.15C88.9113 12.15 88.1841 12.3367 87.5377 12.71C86.9144 13.0833 86.4181 13.5967 86.0487 14.25C85.7024 14.9033 85.5293 15.6733 85.5293 16.56L85.0792 12.255C85.6563 10.9483 86.4989 9.91 87.607 9.14C88.7381 8.34666 90.1233 7.95 91.7623 7.95C93.7245 7.95 95.2251 8.51 96.2639 9.63C97.3027 10.7267 97.8221 12.2083 97.8221 14.075V26.15H92.628Z"
                  fill="#333333"
                />
                <path
                  d="M101.775 26.15V0.949999H106.969V26.15H101.775ZM113.098 26.15L105.757 16.875L112.925 8.3H118.915L110.501 17.68L110.743 16.035L119.262 26.15H113.098Z"
                  fill="#333333"
                />
                <path
                  d="M127.743 26.5C125.158 26.5 123.103 25.975 121.58 24.925C120.056 23.875 119.225 22.4283 119.086 20.585H123.727C123.842 21.3783 124.234 21.985 124.904 22.405C125.596 22.8017 126.543 23 127.743 23C128.828 23 129.613 22.8483 130.098 22.545C130.606 22.2183 130.86 21.7633 130.86 21.18C130.86 20.7367 130.71 20.3983 130.41 20.165C130.133 19.9083 129.613 19.6983 128.852 19.535L126.012 18.94C123.911 18.4967 122.365 17.8317 121.372 16.945C120.379 16.035 119.883 14.8683 119.883 13.445C119.883 11.7183 120.541 10.3767 121.857 9.42C123.173 8.44 125.008 7.95 127.363 7.95C129.694 7.95 131.552 8.42833 132.938 9.385C134.323 10.3183 135.084 11.625 135.223 13.305H130.583C130.491 12.6983 130.167 12.2433 129.613 11.94C129.059 11.6133 128.274 11.45 127.259 11.45C126.335 11.45 125.643 11.59 125.181 11.87C124.742 12.1267 124.523 12.5 124.523 12.99C124.523 13.41 124.708 13.7483 125.077 14.005C125.446 14.2383 126.058 14.4483 126.912 14.635L130.098 15.3C131.876 15.6733 133.215 16.3733 134.115 17.4C135.038 18.4033 135.5 19.5933 135.5 20.97C135.5 22.72 134.819 24.085 133.457 25.065C132.118 26.0217 130.214 26.5 127.743 26.5Z"
                  fill="#333333"
                />
              </svg>
            </div>
          </Typography>
          <div> 
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{
                backgroundColor: "#EFEBFF",
                borderRadius: "8px",
              }}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="navbar-logo-user"
              >
                <path
                  d="M10 1.5625C8.33122 1.5625 6.69992 2.05735 5.31238 2.98448C3.92484 3.9116 2.84338 5.22936 2.20477 6.77111C1.56616 8.31286 1.39907 10.0094 1.72463 11.6461C2.05019 13.2828 2.85379 14.7862 4.03379 15.9662C5.2138 17.1462 6.71721 17.9498 8.35393 18.2754C9.99064 18.6009 11.6871 18.4338 13.2289 17.7952C14.7706 17.1566 16.0884 16.0752 17.0155 14.6876C17.9427 13.3001 18.4375 11.6688 18.4375 10C18.435 7.763 17.5453 5.61833 15.9635 4.03653C14.3817 2.45473 12.237 1.56498 10 1.5625ZM6.21641 15.357C6.65163 14.7619 7.22107 14.2779 7.87849 13.9442C8.5359 13.6106 9.26276 13.4367 10 13.4367C10.7373 13.4367 11.4641 13.6106 12.1215 13.9442C12.7789 14.2779 13.3484 14.7619 13.7836 15.357C12.6778 16.1412 11.3556 16.5625 10 16.5625C8.64436 16.5625 7.32221 16.1412 6.21641 15.357ZM7.8125 9.375C7.8125 8.94235 7.9408 8.51942 8.18116 8.15969C8.42153 7.79996 8.76317 7.51958 9.16288 7.35401C9.5626 7.18845 10.0024 7.14513 10.4268 7.22953C10.8511 7.31394 11.2409 7.52228 11.5468 7.8282C11.8527 8.13413 12.0611 8.52391 12.1455 8.94824C12.2299 9.37257 12.1866 9.81241 12.021 10.2121C11.8554 10.6118 11.575 10.9535 11.2153 11.1938C10.8556 11.4342 10.4327 11.5625 10 11.5625C9.41984 11.5625 8.86344 11.332 8.45321 10.9218C8.04297 10.5116 7.8125 9.95516 7.8125 9.375ZM15.1563 14.0578C14.5486 13.2849 13.7741 12.6595 12.8906 12.2281C13.4537 11.658 13.8355 10.934 13.9881 10.1474C14.1408 9.36074 14.0573 8.54653 13.7484 7.80718C13.4394 7.06783 12.9187 6.43637 12.2517 5.99223C11.5847 5.5481 10.8013 5.31112 10 5.31112C9.19869 5.31112 8.41528 5.5481 7.74831 5.99223C7.08135 6.43637 6.56062 7.06783 6.25165 7.80718C5.94267 8.54653 5.85925 9.36074 6.01187 10.1474C6.16449 10.934 6.54634 11.658 7.10938 12.2281C6.22592 12.6595 5.4514 13.2849 4.84375 14.0578C4.08051 13.0903 3.60512 11.9274 3.472 10.7022C3.33888 9.47711 3.55341 8.23925 4.09104 7.13037C4.62867 6.02148 5.46767 5.08639 6.51199 4.43212C7.55631 3.77786 8.76375 3.43086 9.9961 3.43086C11.2284 3.43086 12.4359 3.77786 13.4802 4.43212C14.5245 5.08639 15.3635 6.02148 15.9012 7.13037C16.4388 8.23925 16.6533 9.47711 16.5202 10.7022C16.3871 11.9274 15.9117 13.0903 15.1484 14.0578H15.1563Z"
                  fill="#633CFF"
                />
              </svg>
              {userData && (<p className="navbar-menu-list navbar-logout navbar-username">{userData.username}</p>)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="7"
                viewBox="0 0 10 7"
                fill="none"
              >
                <path d="M9 1L5 5L1 1" stroke="#633CFF" strokeWidth="2" />
              </svg>
            </IconButton>
            <Menu
              className="navbar-menu-container"
              id="menu-appbar"
              sx={{
                top: "5%",
                ".css-6hp17o-MuiList-root-MuiMenu-list": {
                  width: "124px",
                  padding: " 11px 27px",
                },
                ".css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
                  borderRadius: "8px",
                },
              }}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleClose}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p
                  className="navbar-menu-list navbar-logout"
                  onClick={() => logout()}
                >
                  Logout
                </p>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
