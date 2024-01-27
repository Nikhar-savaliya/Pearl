import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import Navbar from "./components/Navbar.component";
import Home from "./pages/home.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/editor.pages";
import SearchPage from "./pages/search.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);
  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<UserAuthForm type={"sign-in"} />} />
          <Route path="signup" element={<UserAuthForm type={"sign-up"} />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="editor" element={<>editor page</>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
