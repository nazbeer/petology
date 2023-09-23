import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function Profile() {
  const { Option } = Select;

  const { user } = useSelector((state) => state.user);

  const params = useParams();
  const [data, setData] = useState({});
  const [doctor, setDoctor] = useState({});
  const [change, setChange] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changepass, setChangePass] = useState({
    id: user?._id,
    username: user?.name,
    currentpass: "",
    newpass: "",
    confirmpass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeDoctor = (e) => {
    const { name, value } = e.target;
    setDoctor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setChangePass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const onProfileUpdate = async (e) => {
    e.preventDefault();

    axios
      .post(
        "/api/user/update-profile",
        { data, doctor },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const onPassChange = async (e) => {
    e.preventDefault();
    if (changepass.newpass !== changepass.confirmpass) {
      toast.error("Password does not match");
    } else {
      axios
        .post("/api/user/change-password", changepass, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`/api/user/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const userData = response.data.data;
        setData(response.data.data);
        setData({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          userId: userId,
        });
      })
      .catch((error) => console.error(error));

    axios
      .post(
        "/api/doctor/get-doctor-info-by-user-id",
        {
          userId: user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      .then((response) => {
        // toast.success(response.data.message)
        setDoctor(response.data.data);
      })
      .catch((error) => {
        // toast.error(error.data.message)
        console.log(error);
      });
  }, []);
  return (
    <Layout>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header ">
              <h1 className="page-title mt-3">
                {user?.isAdmin
                  ? "Admin Profile"
                  : user?.isDoctor
                  ? "Doctor Profile"
                  : user?.isUser
                  ? "User Profile"
                  : user?.isNurse
                  ? "Reception Profile"
                  : user?.isGroomer
                  ? "Groomer Profile"
                  : ""}
              </h1>
            </div>
            <div card-body mb-3>
              {data && (
                <form onSubmit={onProfileUpdate}>
                  <h1 className="card-title mt-3 ms-3">Personal Information</h1>
                  <div className="row ms-3 me-3">
                    <div className="col-4">
                      {" "}
                      <div className="mb-2">
                        <label htmlFor="name">Name:</label>
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          name="name"
                          value={data?.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      {" "}
                      <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                          className="form-control"
                          type="text"
                          id="email"
                          name="email"
                          value={data?.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      {" "}
                      <div className="mb-2">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                          className="form-control"
                          type="text"
                          id="mobile"
                          name="mobile"
                          value={data?.mobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  {user?.isDoctor && (
                    <div>
                      {" "}
                      <h1 className="card-title mt-3 mt-3 ms-3">
                        Professional Information
                      </h1>
                      <div className="row ms-3 me-3">
                        <div className="col-4">
                          {" "}
                          <div className="mb-2">
                            <label htmlFor="specialization">
                              Specialization
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              id="specialization"
                              name="specialization"
                              value={doctor?.specialization}
                              onChange={handleChangeDoctor}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          {" "}
                          <div className="mb-2">
                            <label htmlFor="experience">Experience</label>
                            <input
                              className="form-control"
                              type="number"
                              id="experience"
                              name="experience"
                              value={doctor?.experience}
                              onChange={handleChangeDoctor}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          {" "}
                          <div className="mb-2">
                            <label htmlFor="feePerCunsultation">
                              Consultation Fee
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              id="feePerCunsultation"
                              name="feePerCunsultation"
                              value={doctor?.feePerCunsultation}
                              onChange={handleChangeDoctor}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row me-3 ms-3">
                        <div className="col">
                          {" "}
                          <div className="mb-2">
                            <label htmlFor="shift">Doctor Shift</label>
                            <input
                              className="form-control"
                              type="text"
                              id="shift"
                              name="shift"
                              value={doctor?.shift}
                              onChange={handleChangeDoctor}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div className="mb-2">
                            <label htmlFor="website">Doctor Website</label>
                            <input
                              className="form-control"
                              type="text"
                              id="website"
                              name="website"
                              value={doctor?.website}
                              onChange={handleChangeDoctor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-end me-3 mb-3 mt-3">
                    <button type="submit" className="btn btn-success btn-sm">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card ">
            <div className="card-header">
              <h1 className="card-title mt-3">Change Password</h1>
            </div>
            <div card-body mb-3>
              <form onSubmit={onPassChange}>
                <div className="row ms-3 me-3 mt-3">
                  <div className="col-4">
                    {" "}
                    <div className="mb-2">
                      <label htmlFor="currentpass">Current Passoword</label>
                      <input
                        className="form-control"
                        type="password"
                        id="currentpass"
                        name="currentpass"
                        value={changepass.currentpass}
                        onChange={handleChangePass}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    {" "}
                    <div className="mb-2">
                      <label htmlFor="newpass">New Password</label>
                      <input
                        className="form-control"
                        type="password"
                        id="newpass"
                        name="newpass"
                        value={changepass.newpass}
                        onChange={handleChangePass}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    {" "}
                    <div className="mb-2">
                      <label htmlFor="confirmpass">Confirm Password</label>
                      <input
                        className="form-control"
                        type="password"
                        id="confirmpass"
                        name="confirmpass"
                        value={changepass.confirmpass}
                        onChange={handleChangePass}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end me-3 mb-3 mt-3">
                  <button type="submit" className="btn btn-success btn-sm">
                    Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
