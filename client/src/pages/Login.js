import { Button, Form, Input, Tabs } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import logo from "../images/logo-petology.png";
import Header from "../frontend_components/Header";
import jwt_decode from "jwt-decode";
import MobileLogin from './MobLogin';
const { TabPane } = Tabs;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("email"); // Default to "Login with Email"

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`/api/user/login-${activeTab}`, values);
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);

        const decodedToken = jwt_decode(response.data.data);
        const userId = decodedToken.id;
        localStorage.setItem("userId", userId);

        if (response.data.isUser === true) {
          navigate("/user");
        } else if (response.data.isDoctor === true) {
          navigate("/doctor");
        } else if (response.data.isAdmin === true) {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message);
    }
  };

  return (
    <main>
      <Header />
      <div className="authentication">
        <div className="authentication-form text-center p-3">
          <div className="text-center">
            <img
              src={logo}
              alt="logo"
              width="100px"
              className="text-center d-flex"
              style={{ marginLeft: "35%" }}
            />
          </div>

          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
            <TabPane tab="Login with Email" key="email" >
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Email/Username" name="identifier">
                  <Input placeholder="Email/Username" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                  <Input placeholder="Password" type="password" />
                </Form.Item>

                <Button
                  className="btn btn-success btn-sm my-2 full-width-button"
                  htmlType="submit"
                >
                  LOGIN
                </Button>
              </Form>
            </TabPane>
            <TabPane tab="Login with Mobile" key="mobile">
              {/* Add the form for mobile login here */}
              <MobileLogin/>
            </TabPane>
          </Tabs>
          <Link to="/register" className="text-dark mt-2 text-center d-block">
            CLICK HERE TO REGISTER
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;
