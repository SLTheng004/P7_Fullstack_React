import React, { useState, useContext } from 'react'
import '../css/Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const login = () => {
    const data = {
      username: username,
      password: password
    };
    axios.post('http://localhost:4000/auth/login', data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem('accessToken', response.data.token);
        setAuthState({
          username: response.data.username,
          id: 0,
          status: true
        });
        navigate('/');
      }
    });
  };


  return (
    <div className="loginContainer">
      <h1>Login</h1>
      <input
        autoComplete="off"
        className="inputLogin"
        type="text"
        placeholder="username..."
        onChange={(event) => {
          setUsername(event.target.value);
        }} />
      <input
        autoComplete="off"
        className="inputLogin"
        type="password"
        placeholder="password..."
        onChange={(event) => {
          setPassword(event.target.value);
        }} />

      <button onClick={login} className="loginButton">Login</button>
    </div>
  )
}

export default Login