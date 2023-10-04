import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Form, Input, Button } from "antd";

function AdminProfile() {
  const userId = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/get-admin-profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      setLoading(false);
      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching profile data");
    }
  };

  const resetPassword = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/admin/reset-admin-password/${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLoading(false);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error resetting password");
    }
  };

  const onFinish = (values) => {
    resetPassword(values);
  };

  return (
    <Layout>
      <div className="col-md-8 mx-auto">
        <h4 className="mb-4">Admin Profile</h4>
        <Form
          name="profile"
          labelCol={{ span: 4 }} // Adjust the span value as needed
          wrapperCol={{ span: 12 }}
          // initialValues={profileData} onFinish={onFinish}
        >
          <Form.Item label="First Name" name="firstName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            style={{ border: "0px" }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              className="btn btn-success btn-sm"
              type="primary"
              htmlType="submit"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default AdminProfile;
