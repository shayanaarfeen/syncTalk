import { useNavigate } from "react-router-dom";


const ConversationsItem = ({ prop, lightTheme}) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="conversation-container"
      onClick={() => {
        navigate("chat/" + prop.name);
      }}
    >
      <p className={"con-icon" + (lightTheme ? "" : " dark")}>{prop.name[0]}</p>
      <p className={"con-title" + (lightTheme ? "" : " dark")}>{prop.name}</p>
      <p className="con-lastMessage">{prop.lastMessage}</p>
      <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
        {prop.timeStamp}
      </p>
    </div>
  );
}

export default ConversationsItem