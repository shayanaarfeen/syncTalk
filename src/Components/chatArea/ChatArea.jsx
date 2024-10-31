import React, { useContext, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import MessageOthers from "./MessageOthers";
import MessageSelf from "./MessageSelf";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "../MainContainer";
import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_API_URL;

const ChatArea = () => {
  const lightTheme = useSelector((state) => state.themeKey);

  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // Use useRef for socket

  const userData = JSON.parse(localStorage.getItem("userData"));

  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");

  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .post(
        ENDPOINT+"/api/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        socketRef.current.emit("newMessage", data);
      });
  };

  // connect to socket
  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    socketRef.current.emit('setup', userData);
    socketRef.current.on('connection', () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // new message received
  useEffect(() => {
    socketRef.current.on("message received", (newMessage) => {
      if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
        setAllMessages([...allMessages, newMessage]);
      }
    });
  }, [allMessages, allMessagesCopy]);

  // fetch chats
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios
      .get(ENDPOINT+"/api/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socketRef.current.emit("join chat", chat_id);
      });
    setAllMessagesCopy(allMessages);
  }, [refresh, chat_id, userData.data.token, allMessages]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
          </div>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={"messages-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setMessageContent("");
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default ChatArea;
