import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';
import axios from 'axios';
import '../css/Profile.css';

function Profile({ logout }) {
  const { authState, setAuthState } = useContext(AuthContext);
  let navigate = useNavigate();

  //check if auth, else send to login
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate('/login');
    } else {
      axios.get('http://localhost:4000/auth/user', {
                headers: { accessToken: localStorage.getItem('accessToken') }
    }).then((response) => [
      setAuthState({
        username: response.data.username,
        id: response.data.id,
        status: true,
      })
    ])
    }
  }, []);

  //delete user
  const onDelete = () => {
    axios.delete('http://localhost:4000/auth/user/' + authState.id,
      {
        headers: { accessToken: localStorage.getItem('accessToken') }
      }).then((response) => {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: false,
        })
        logout();
        navigate('/login');
        alert('Account Deleted!')
      });
  }

  return (
    <div>
      <p>Settings:</p>
      <button onClick={onDelete}>Delete Account</button>
    </div>
  )
}

export default Profile