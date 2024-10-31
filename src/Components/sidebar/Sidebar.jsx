import { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../Features/themeSlice";
import axios from "axios";
import { myContext } from "../MainContainer";
import { refreshSidebarFun } from "../../Features/refreshSidebar";

const ENDPOINT = import.meta.env.VITE_API_URL;

const Sidebar = () => {

  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  
  const nav = useNavigate();

  // const refresh = useSelector((state) => state.refreshKey);
  const { refresh, setRefresh } = useContext(myContext);
  // console.log("Context API : refresh : ", refresh);


  const [conversations, setConversations] = useState([]);
// console.log("Conversations of Sidebar : ", conversations);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const mainuser = userData.data;

  // Client-side logout function
  const logout = () => {
    localStorage.removeItem("userData");
    nav("/");
  };


  useEffect(() => {
    // console.log("Sidebar : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${mainuser.token}`,
      },
    };

    axios.get(ENDPOINT+"/api/chat/", config).then((response) => {
      // console.log("Data refresh in sidebar ", response.data);
      setConversations(response.data);
      // setRefresh(!refresh);
    });
  }, [refresh]);
    
  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div>
          <IconButton
            onClick={() => {
              nav("/app/welcome");
            }}
          >
            <AccountCircleIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>
        </div>
        <div className="other-icons">
          <IconButton
            onClick={() => {
              nav("users");
            }}
          >
            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>

          <IconButton
            onClick={() => {
              nav("groups");
            }}
          >
            <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>

          <IconButton
            onClick={() => {
              nav("create-groups");
            }}
          >
            <AddCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>

          <IconButton
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {lightTheme && (
              <NightlightIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            )}

            {!lightTheme && (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>

          <IconButton 
            onClick={() => {logout()}}
          >
            <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>

      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={"search-box" + (lightTheme ? "" : " dark")}
        />
      </div>

      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
      {conversations.map((conversation, index) => {
          // console.log("current convo : ", conversation);
          
          
          const username = conversation.users
          .filter(user => user._id !== mainuser._id) // Filter out the main user
          .map(user => {
              // console.log("username : ", user.name); // Prints names other than the main user
              return user.name; // Return the user's name
          });
      
      // console.log("convo : ", username);
          
          
          if (conversation.users.length === 1) {
            return <div key={index}></div>;
          }
          if (conversation.latestMessage === undefined) {
            // console.log("No Latest Message with ", conversation.users[1]);
            return (
              <div
                key={index}
                onClick={() => {
                  // console.log("Refresh fired from sidebar");
                  // dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    nav(
                      "chat/" +
                        conversation._id +
                        "&" +
                        username
                    );
                  }}
                  // dispatch change to refresh so as to update chatArea
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {username[0].charAt(0).toUpperCase()}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {username}
                  </p>
                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                  {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  nav(
                    "chat/" +
                      conversation._id +
                      "&" +
                      username
                  );
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                {username[0].charAt(0).toUpperCase()}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                {username}
                </p>

                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                </p>
                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Sidebar;
