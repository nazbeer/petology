
// Header.js
import React, { useState } from 'react';
import './Header.css';
import logo from './logo-petology.png';
const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="header1 bg-pet" >
      <div className="logo">
        <a href="/">
        <img src={logo} alt="Logo" width="auto" />
        </a>
      </div>
      <nav className={`menu ${showMobileMenu ? 'mobile-menu' : 'desktop-menu gap-3'}`}>
        <ul>
          <a href="/veterinary" className='text-decoration-none custom-menu text-peto'><li >Veterinary Clinic</li></a>
          <a href="/grooming" className='text-decoration-none custom-menu text-peto'><li>Grooming Shop</li></a>
          <a href="/mobilevet" className='text-decoration-none custom-menu text-peto'><li>Mobile Veterinary</li></a>
          <a href="/mobilegrooming" className='text-decoration-none custom-menu text-peto'><li>Mobile Grooming</li></a>
         <div className='custom-signup '> <a href="/login" className='text-decoration-none'><li><button className='btn btn-success btn-sm'>Login</button></li></a>
          <a href="/register" className='text-decoration-none'><li><button className='btn btn-success btn-sm'>Register</button></li></a>
          </div>
        </ul>
      </nav>
      <div  className="mobile-menu-icon" onClick={toggleMobileMenu}>
        <div className={`bar ${showMobileMenu ? 'active' : ''}`} />
        <div className={`bar ${showMobileMenu ? 'active' : ''}`} />
        <div className={`bar ${showMobileMenu ? 'active' : ''}`} />
      </div>
    </header>
  );
};

export default Header;
