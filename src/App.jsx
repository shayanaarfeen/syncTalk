import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from "./Components/login/Login";
import MainContainer from "./Components/MainContainer";
import Welcome from "./Components/chatArea/Welcome";
import ChatArea from "./Components/chatArea/ChatArea";
import Users from "./Components/user/Users";
import Group from "./Components/group/Group";
import CreateGroups from "./Components/group/CreateGroups";

const router = createBrowserRouter(
  createRoutesFromElements(
    <React.Fragment>
      <Route path="/" element={<Login />} />
      <Route path="app" element={<MainContainer />}>
        <Route path="welcome" element={<Welcome />} />
        <Route path="chat/:_id" element={<ChatArea />} />
        <Route path="users" element={<Users />} />
        <Route path="groups" element={<Group />} />
        <Route path="create-groups" element={<CreateGroups />} />
      </Route>
    </React.Fragment>
  )
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
