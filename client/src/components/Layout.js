import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import logo from "../images/logo-petology.png";
function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    {
      name: "Home",
      path: "/user",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/user/appointmentlist",
      icon: "ri-file-list-line",
    },
    // {
    //   name: "Apply Doctor",
    //   path: "/apply-doctor",
    //   icon: "ri-hospital-line",
    // }
    {
      name:"Add Pets",
      path:"/user/addpet",
      icon:'ri-bear-smile-line'
    },
    {
      name:"Pets",
      path:"/user/pets",
      icon:'ri-bear-smile-line'
    },
  ];
  const nurseMenu = [
    {
      name: "Home",
      path: "/home",
      icon: "ri-home-line",
    },

  ];
  const doctorMenu = [
    {
      name: "Home",
      path: "/doctor",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Add Prescription",
      path: "/doctor/addprescription",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/admin",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/admin/appointmentlist",
      icon: "ri-user-star-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
    {
      name:"Pets",
      path:"/admin/petlist",
      icon:'ri-bear-smile-line'
    },
    // {
    //   name:"Add Pets",
    //   path:"/admin/addpet",
    //   icon:'ri-bear-smile-line'
    // },
    {
      name:"Break Time",
      path:"/admin/breaktime",
      icon: 'ri-time-line',
    },
    {
      name:"Add Service",
      path:"/admin/addservice",
      icon:'ri-bear-smile-line'
    },
    {
      name:"Services List",
      path:"/admin/servicelist",
      icon:'ri-booklet-fill',
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu :  user?.isUser ? userMenu : user?.isNurse ? nurseMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : user?.isUser ? "User" : user?.isNurse ? "Nurse" :"User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo text-center pt-2"><img src={logo} alt="Petolog" width="50%"/></h1>
            <h1 className="role pt-2 text-center">{role} Dashboard</h1>
          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item `}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/logout">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>

              <Link className="anchor text-decoration-none mx-2" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;