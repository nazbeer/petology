import { Button, Form, Input } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import logo from "../images/logo-petology.png";
import Header from "../frontend_components/Header";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        navigate('/login');
        if (response.data.data.isUser === true) {
          navigate("/user"); // Navigate to the user page
        } else if (response.data.data.isDoctor === true) {
          navigate("/doctor"); // Navigate to the doctor page
        }   else if (response.data.data.isAdmin === true) {
          navigate("/dashboard"); // Navigate to the doctor page
        } else {
          // If the user type is not specified or invalid, you can handle the navigation accordingly.
          navigate("/home"); // Navigate to the home page or any other fallback page.
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
   <main>
  <Header/>
    <div className="authentication">
      <div className="authentication-form  text-center p-3">
        <div className="text-center"><img src={logo} alt="logo" width="100px" className="text-center d-flex" style={{marginLeft:'35%'}} /></div>
        {/* <h1 className="card-title">Appointment System</h1> */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="text-dark mt-2 text-center d-block">
            CLICK HERE TO REGISTER
          </Link>
         
        </Form>
      </div>
    </div>
    </main>
  );
}

export default Login;
