import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, Tooltip } from "antd";
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
      path: "/user/userappointments",
      icon: "ri-file-list-line",
    },

    // {
    //   name: "Doctors",
    //   path: "/user/doctors",
    //   icon: "ri-hospital-line",
    // },
    {
      name: "Booking",
      path: "/user/booking",
      icon: "ri-hospital-line",
    },

    {
      name: "Payments",
      path: "/user/payment",
      icon: "ri-hospital-line",
    },

    // {
    //   name:"Add Pets",
    //   path:"/user/addpet",
    //   icon:'ri-bear-smile-line'
    // },
    {
      name: "Pets",
      path: "/user/pets",
      icon: "ri-bear-smile-line",
    },
  ];
  const receptionMenu = [
    {
      name: "Home",
      path: "/reception",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/reception/appointmentlist",
      icon: "ri-user-star-line",
    },
    {
      name: "WalkIn Booking",
      path: "/reception/walkin",
      icon: "ri-user-star-line",
    },
    {
      name: "Payments",
      path: "/reception/payment",
      icon: "ri-hospital-line",
    },
    {
      name: "Users",
      path: "/reception/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/reception/doctorslist",
      icon: "ri-user-star-line",
    },
    {
      name: "Pets",
      path: "/reception/petlist",
      icon: "ri-bear-smile-line",
    },
    // {
    //   name:"Add Pets",
    //   path:"/admin/addpet",
    //   icon:'ri-bear-smile-line'
    // },
    {
      name: "Break Time",
      path: "/reception/breaktime",
      icon: "ri-time-line",
    },
    // {
    //   name:"Add Service",
    //   path:"/admin/addservice",
    //   icon:'ri-bear-smile-line'
    // },
    {
      name: "Services List",
      path: "/reception/servicelist",
      icon: "ri-booklet-fill",
    },
    {
      name: "Office Timings",
      path: "/admin/office-timings",
      icon: "ri-booklet-fill",
    },
    // {
    //   name: "Profile",
    //   path: `/reception/profile/${user?._id}`,
    //   icon: "ri-user-line",
    // },
  ];
  const groomerMenu = [
    {
      name: "Home",
      path: "/groomer",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/groomer/appointments",
      icon: "ri-file-list-line",
    },
    // {
    //   name: "Add Prescription",
    //   path: "/doctor/addprescription",
    //   icon: "ri-file-list-line",
    // },
    // {
    //   name: "Profile",
    //   path: `/groomer/profile/${user?._id}`,
    //   icon: "ri-user-line",
    // },
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
      icon: "ri-pulse-line",
    },
    // {
    //   name: "Add Prescription",
    //   path: "/doctor/addprescription",
    //   icon: "ri-file-list-line",
    // },
    {
      name: "Prescriptions",
      path: "/doctor/prescriptions",
      icon: "ri-file-list-3-line",
    },
    // {
    //   name: "Profile",
    //   path: `/doctor/profile/${user?._id}`,
    //   icon: "ri-user-line",
    // },
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
      name: "WalkIn Booking",
      path: "/admin/walkin",
      icon: "ri-user-star-line",
    },
    {
      name: "Payments",
      path: "/admin/payment",
      icon: "ri-hospital-line",
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
      name: "Upload History",
      path: "/admin/uploadhistory",
      icon: "ri-survey-line",
    },
    {
      name: "Pets",
      path: "/admin/petlist",
      icon: "ri-bear-smile-line",
    },
    // {
    //   name:"Add Pets",
    //   path:"/admin/addpet",
    //   icon:'ri-bear-smile-line'
    // },
    // {
    //   name:"Break Time",
    //   path:"/admin/breaktime",
    //   icon: 'ri-time-line',
    // },
    // {
    //   name:"Add Service",
    //   path:"/admin/addservice",
    //   icon:'ri-bear-smile-line'
    // },
    {
      name: "Services",
      path: "/admin/addservices",
      icon: "ri-booklet-fill",
    },
    {
      name: "Office Timings",
      path: "/admin/office-timings",
      icon: "ri-booklet-fill",
    },
    // {
    //   name: "Profile",
    //   path: `/admin/profile/${user?._id}`,
    //   icon: "ri-user-line",
    // },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : user?.isUser
    ? userMenu
    : user?.isNurse
    ? receptionMenu
    : user?.isGroomer
    ? groomerMenu
    : userMenu;
  const role = user?.isAdmin
    ? "Admin"
    : user?.isDoctor
    ? "Doctor"
    : user?.isUser
    ? "User"
    : user?.isNurse
    ? "Reception"
    : user?.isGroomer
    ? "Groomer"
    : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo text-center pt-2">
              <img src={logo} alt="Petolog" width="50%" />
            </h1>
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
                  <Tooltip title={menu.name}>
                    <Link to={menu.path}>
                      <i className={menu.icon}></i>
                    </Link>
                  </Tooltip>
                  {!collapsed && (
                    <Tooltip title={menu.name}>
                      <Link to={menu.path}>{menu.name}</Link>
                    </Tooltip>
                  )}
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

              <Link className="anchor text-decoration-none mx-2" to="/profile/">
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
