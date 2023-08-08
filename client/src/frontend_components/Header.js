// import React from 'react';
// import logo from '../logo.svg';
// const Header = () => {
//    return(
//     <header>
//      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//             <div className="container ">
//               <div className="container d-flex justify-content-between align-items-center">
//                 <a className="navbar-brand" href="#">Petology Booking</a>
//                 {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button> */}
//                 <div className=" text-right pull-right d-none d-sm-block" id="navbarSupportedContent">
//                     <ul className="navbar-nav ml-4 mb-2 mb-lg-0 pull-right text-right">
                        
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/">Veterinary Clinic</a></li>
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/grooming">Grooming Shop</a></li>
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/mobilevet">Mobile Veterinary</a></li>
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/mobilegrooming">Mobile Grooming</a></li>
//                         {/* <li className="nav-item"><a className="nav-link " aria-current="page" href="/doctors">Doctors</a></li>
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/listappointments">Appointments</a></li> */}
//                         <li className="nav-item"><a className="nav-link " aria-current="page" href="/login">Login</a></li>
//                         {/* {loggedIn && <li><button value={loggedIn} onClick={this.handleLogout}>Logout</button></li>} */}
                       
//                     </ul>
//                 </div>
//                 </div>
//             </div>
//         </nav>

//     </header>
//    )
// }

// export default Header;


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
      <nav className={`menu ${showMobileMenu ? 'mobile-menu' : 'menu'}`}>
        <ul>
          <a href="/veterinary" className='text-decoration-none'><li >Veterinary Clinic</li></a>
          <a href="/grooming" className='text-decoration-none'><li>Grooming Shop</li></a>
          <a href="/mobilevet" className='text-decoration-none'><li>Mobile Veterinary</li></a>
          <a href="/mobilegrooming" className='text-decoration-none'><li>Mobile Grooming</li></a>
          <a href="/login" className='text-decoration-none'><li><button className='btn btn-success btn-sm'>Login</button></li></a>
          <a href="/register" className='text-decoration-none'><li><button className='btn btn-success btn-sm'>Register</button></li></a>
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
