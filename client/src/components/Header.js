import React from 'react';
import '../css/Header.css';
import logoUrl from '../assets/groupomanialogo.png';
const Header = () => (
  <div className="header">
    <img src={logoUrl} alt="Groupomania" />
  </div>
)
export default Header;