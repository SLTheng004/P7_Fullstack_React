import React, { useEffect, useContext,useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';
import axios from 'axios';

function Profile({logout}) {
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();
    
    useEffect(() => {
      //check if auth
      if (!localStorage.getItem("accessToken")) {
        navigate('/login');
      }
  }, []);

  const onDelete = () => {
    axios.delete('http://localhost:4000/auth/user/' + authState.id,
     {  headers: { accessToken: localStorage.getItem('accessToken') }} ).then(() => {
        logout();
        navigate('/login');
     })
  }

  return (
    <div>
      <p>Settings:</p>
      <button onClick={ onDelete }>Delete Account</button>
    </div>
  )
}

export default Profile