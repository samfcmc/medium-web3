import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import LogoutIcon from "@mui/icons-material/Logout";
import RateReviewIcon from "@mui/icons-material/RateReview";

import logo from "../images/m.png";
import { useCallback } from "react";

const Sidebar = () => {
  const { logout } = useMoralis();
  const onLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <>
      <div className="siderContent">
        <img className="logo" src={logo} alt="Logo" />
        <div className="menu">
          <Link to="/" className="link">
            <div className="menuItems">
              <HomeIcon />
            </div>
          </Link>
          <Link to="/myBlogs" className="link">
            <div className="menuItems">
              <BookIcon />
            </div>
          </Link>
          <Link to="/newStory" className="link">
            <div className="menuItems">
              <RateReviewIcon />
            </div>
          </Link>
        </div>
        <div className="logout" onClick={onLogout}>
          <LogoutIcon />
        </div>
      </div>
    </>
  );
};

export default Sidebar;