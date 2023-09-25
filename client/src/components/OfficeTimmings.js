import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "./Layout";

function OfficeTimmings() {
  const [vetTime, setVetTime] = useState({
    module: "vet",
    starttime: "",
    endtime: "",
    break: "",
  });

  const [groomTime, setGroomTime] = useState({
    module: "groom",
    starttime: "",
    endtime: "",
    break: "",
  });

  console.log(vetTime.starttime);

  const handleChangeVet = (e) => {
    const { name, value } = e.target;

    setVetTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeGroom = (e) => {
    const { name, value } = e.target;

    setGroomTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const timeFormat = (value) => {
    let [hour, minute] = value.split(":").map(Number);
    let amPm = "AM";
    minute = String(minute).padStart(2, "0");
    if (hour >= 12) {
      amPm = "PM";
      if (hour > 12) {
        hour -= 12;
      }
    }
    hour = String(hour).padStart(2, "0");
    return `${hour}:${minute} ${amPm}`;
  };

  const handleSubmitVet = async (e) => {
    e.preventDefault();

    const starttime = timeFormat(vetTime.starttime);
    const endtime = timeFormat(vetTime.endtime);

    console.log(starttime, endtime);

    try {
      const response = await axios.post(
        "/api/admin//offie-time",
        { module: vetTime.module, starttime, endtime, break: vetTime.break },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        console.log(response?.data?.data);

        // Do something else, like navigating to another page
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in booking appointment.");
    }
  };

  const handleSubmitGroom = async (e) => {
    e.preventDefault();

    const starttime = timeFormat(groomTime.starttime);
    const endtime = timeFormat(groomTime.endtime);

    console.log(starttime, endtime);

    try {
      const response = await axios.post(
        "/api/admin//offie-time",
        {
          module: groomTime.module,
          starttime,
          endtime,
          break: groomTime.break,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        console.log(response?.data?.data);

        // Do something else, like navigating to another page
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in booking appointment.");
    }
  };

  return (
    <Layout>
      <div className="row mt-5">
        <div className="col">
          <div className="card">
            <h1 className="card-title mt-3 ms-3 mb-3">
              Veterinary Office Timing
            </h1>
            <form onSubmit={handleSubmitVet}>
              <div className="row me-3 ms-3">
                <div className="col">
                  <div className="mb-2">
                    <label htmlFor="starttime">Start Time:</label>
                    <input
                      className="form-control"
                      type="time"
                      id="starttime"
                      name="starttime"
                      value={vetTime.starttime}
                      onChange={handleChangeVet}
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-2">
                    <label htmlFor="endtime">End Time:</label>
                    <input
                      className="form-control"
                      type="time"
                      id="endtime"
                      name="endtime"
                      value={vetTime.endtime}
                      onChange={handleChangeVet}
                      required
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="break">Break Time </label>
                  <select
                    className="form-control"
                    id="break"
                    name="break"
                    value={vetTime.break}
                    onChange={handleChangeVet}
                  >
                    <option defaultValue="">Select Break Time...</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="60">90 Minutes</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end me-3 mb-3 mt-3">
                <button type="submit" className="btn btn-success btn-sm">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h1 className="card-title mt-3 ms-3 mb-3">
              Grooming Office Timing
            </h1>
            <form onSubmit={handleSubmitGroom}>
              <div className="row me-3 ms-3">
                <div className="col">
                  <div className="mb-2">
                    <label htmlFor="starttime">Start Time:</label>
                    <input
                      className="form-control"
                      type="time"
                      id="starttime"
                      name="starttime"
                      value={groomTime.starttime}
                      onChange={handleChangeGroom}
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-2">
                    <label htmlFor="endtime">End Time:</label>
                    <input
                      className="form-control"
                      type="time"
                      id="endtime"
                      name="endtime"
                      value={groomTime.endtime}
                      onChange={handleChangeGroom}
                      required
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="break">Break Time </label>
                  <select
                    className="form-control"
                    id="break"
                    name="break"
                    value={groomTime.break}
                    onChange={handleChangeGroom}
                    required
                  >
                    <option defaultValue="">Select Break Time...</option>
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="60">90 Minutes</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-end me-3 mb-3 mt-3">
                <button type="submit" className="btn btn-success btn-sm">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OfficeTimmings;
