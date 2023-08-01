import './App.css';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Header from './components/Header';
import Post from './pages/Post';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

// if not authenticated, send error message
  useEffect(() => {
    axios.get('http://localhost:4000/auth/user', {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
      },
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Header />
          <div className="navbar">
            {!authState.status ? (
              <>
                <NavLink to="/login">Login </NavLink>
                <NavLink to="/registration">Signup</NavLink>
              </>
            ) : (
              <>
                <div className="navbarContainer1">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/createpost"> Create Post </NavLink>
                </div>
                <div className="navbarContainer2">
                  <NavLink to="/profile" id="profile">{authState.username}</NavLink>
                  <NavLink to="/login" button onClick={logout}> Logout</NavLink>
                </div>
              </>
            )}
          </div>

          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/profile" element={<Profile logout={logout} />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
