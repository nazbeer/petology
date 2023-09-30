import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "./Layout";
import moment from "moment";
import { TimePicker, Select, Table, DatePicker } from "antd";

function OfficeTimmings() {
  const [time, setTime] = useState([]);
  const [holidayDate, setholidayDate] = useState([]);
  const [groomsTime, setGroomsTime] = useState([]);
  const { RangePicker } = TimePicker;
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

  console.log(groomTime);
  const onChangeVetRange = (value, dateString) => {
    setVetTime((prev) => ({
      ...prev,
      starttime: dateString[0],
      endtime: dateString[1],
    }));
    console.log(dateString[0]);
    console.log(dateString[1]);
  };

  const onChangeDate = (value, dateString) => {
    console.log(moment(dateString).format("YYYY-MM-DDTHH:mm:ss.000+00:00"));
    setholidayDate(moment(dateString).format("YYYY-MM-DDTHH:mm:ss.000+00:00"));
  };

  const onChangeGroomRange = (value, dateString) => {
    setGroomTime((prev) => ({
      ...prev,
      starttime: dateString[0],
      endtime: dateString[1],
    }));
    console.log(dateString[0]);
    console.log(dateString[1]);
  };

  const onVetBreakChange = (value) => {
    setVetTime((prev) => ({
      ...prev,
      break: value,
    }));
    console.log(value);
  };

  const onGroomBreakChange = (value) => {
    setGroomTime((prev) => ({
      ...prev,
      break: value,
    }));
    console.log(value);
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

  const handleHolidayCancel = async () => {
    if (holidayDate) {
      try {
        const response = await axios.post(
          "/api/admin/cancel-appointment-holiday",
          { date: holidayDate },
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
        toast.error("Error in cancelling appointment.");
      }
    }
  };

  const handleSubmitVet = async (e) => {
    e.preventDefault();

    console.log(vetTime);

    const starttime = timeFormat(vetTime.starttime);
    const endtime = timeFormat(vetTime.endtime);

    console.log(starttime, endtime);

    try {
      const response = await axios.post(
        "/api/admin/offie-time",
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
        "/api/admin/offie-time",
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

  const getOfficeTime = (module) => {
    axios
      .post(
        "/api/admin/get-office-time",
        { module: "vet" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response?.data?.data);

        setTime([response?.data?.data]);
      })
      .catch((error) => console.error(error));

    axios
      .post(
        "/api/admin/get-office-time",
        { module: "groom" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response?.data?.data);

        setGroomsTime([response?.data?.data]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getOfficeTime();
  }, []);

  const columns = [
    {
      title: "Start Time",
      dataIndex: "starttime",
      render: (text, record) => <span>{record?.starttime}</span>,
    },
    {
      title: "End Time",
      dataIndex: "endtime",
      render: (text, record) => <span>{record?.endtime}</span>,
    },
    {
      title: "Break Time",
      dataIndex: "break",
      render: (text, record) => <span>{record?.break}</span>,
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>{moment(record?.updatedAt).format("LLL")}</span>
      ),
    },
  ];

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
                <label htmlFor="break">Office Time </label>
                <div className=" mb-3 ms-2 me-2">
                  <RangePicker
                    style={{ width: "98%" }}
                    format={"HH:mm"}
                    onChange={onChangeVetRange}
                  />
                </div>
                <div className="mb-2 ">
                  <label htmlFor="break">Break Time </label>
                  <Select
                    className="form-control"
                    id="break"
                    name="break"
                    defaultValue="15 Minutes"
                    // value={groomTime.break}
                    onChange={onVetBreakChange}
                    placeholder="Select break time"
                    required
                    bordered={false}
                    options={[
                      { value: "15 Minutes", label: "15 Minutes" },
                      { value: "30 Minutes", label: "30 Minutes" },
                      { value: "45 Minutes", label: "45 Minutes" },
                      { value: "60 Minutes", label: "60 Minutes" },
                      { value: "90 Minutes", label: "90 Minutes" },
                    ]}
                  ></Select>
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
                <label htmlFor="break">Office Time </label>
                <div className=" mb-3 ms-2 me-2">
                  <RangePicker
                    style={{ width: "98%" }}
                    format={"HH:mm"}
                    onChange={onChangeGroomRange}
                  />
                </div>
                <div className="mb-2 ">
                  <label htmlFor="break">Break Time </label>
                  <Select
                    className="form-control"
                    id="break"
                    name="break"
                    defaultValue="15 Minutes"
                    // value={groomTime.break}
                    onChange={onGroomBreakChange}
                    placeholder="Select break time"
                    required
                    bordered={false}
                    options={[
                      { value: "15 Minutes", label: "15 Minutes" },
                      { value: "30 Minutes", label: "30 Minutes" },
                      { value: "45 Minutes", label: "45 Minutes" },
                      { value: "60 Minutes", label: "60 Minutes" },
                      { value: "90 Minutes", label: "90 Minutes" },
                    ]}
                  ></Select>
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
      <div className="card mt-3">
        <h4 className="m-3">Veterinary Office Timmings</h4>
        <Table
          className="m-3"
          columns={columns}
          dataSource={time}
          responsive={true}
          scroll={{ x: true }}
        />

        <h4 className="m-3">Grooming Office Timmings</h4>
        <Table
          className="m-3"
          columns={columns}
          dataSource={groomsTime}
          responsive={true}
          scroll={{ x: true }}
        />
      </div>
      <div className="card mt-3">
        <h1 className="card-title mt-3 ms-3 mb-3">Holiday Alert</h1>
        <div className="m-4">
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            onChange={onChangeDate}
            disabledDate={(current) => {
              return moment().add(-1, "days") >= current;
            }}
          />
        </div>
        <div className="d-flex justify-content-end me-3 mb-3 mt-3">
          <button
            className="btn btn-success btn-sm"
            onClick={handleHolidayCancel}
          >
            Change
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default OfficeTimmings;
