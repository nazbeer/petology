import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import logo from "../images/logo-petology.png";
import Header from "../frontend_components/Header";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      console.log(response.data); // Check the response for debugging purposes
      dispatch(hideLoading());
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message);
    }
  };

  return (
    <main className="bg-login">
      <Header />
      <div className="authentication">
        <div className="authentication-form  p-3">
          <div className="text-center">
            <img
              src={logo}
              alt="logo"
              width="100px"
              className="text-center d-flex"
              style={{ marginLeft: "35%" }}
            />
          </div>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Username" name="username">
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Mobile" name="mobile">
              <Input placeholder="Mobile" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input placeholder="Password" type="password" />
            </Form.Item>

            <Button
              className="btn btn-success btn-sm my-2 full-width-button"
              htmlType="submit"
            >
              REGISTER
            </Button>

            <Link to="/login" className="text-dark text-center mt-2 d-block">
              CLICK HERE TO LOGIN
            </Link>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default Register;
