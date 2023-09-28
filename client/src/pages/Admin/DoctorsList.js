import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  TimePicker,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import JsPDF from "jspdf";
import "jspdf-autotable";

function DoctorsList() {
  const { RangePicker } = DatePicker;

  const [time, setTime] = useState({
    starttime: "",
    endtime: "",
  });
  const [doctors, setDoctors] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [editingDoctor, setEditingDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const [availableModalVisible, setAvailableModalVisible] = useState(false);

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveForm] = Form.useForm();
  const [leaveDoctor, setLeaveDoctor] = useState([]);

  const [filter, setFilter] = useState(true);

  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

  const openLeaveModal = (doctor) => {
    leaveForm.resetFields();
    setLeaveDoctor(doctor); // Use setLeaveDoctor here
    leaveForm.setFieldsValue({ doctorId: doctor._id });
    setLeaveModalVisible(true);
  };

  const openAvailablityModal = (doctorId) => {
    setDoctorId(doctorId);
    console.log(doctorId);
    setAvailableModalVisible(true);
  };

  const closeAvailablityModal = () => {
    setDoctorId("");
    setAvailableModalVisible(false);
  };

  const closeLeaveModal = () => {
    setLeaveModalVisible(false);
  };

  const onChange = (value, dateString) => {
    setTime({
      starttime: dateString[0],
      endtime: dateString[1],
    });
    console.log(dateString[0]);
    console.log(dateString[1]);
  };

  const handleSetLeave = async () => {
    try {
      setLeaveLoading(true);
      const values = await leaveForm.validateFields();
      //console.log(values);
      await axios.post("/api/admin/set-doctor-leave", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Doctor leave set successfully");
      closeLeaveModal();
      setLeaveLoading(false);
    } catch (error) {
      toast.error("Error setting doctor leave");
      setLeaveLoading(false);
    }
  };

  const getDoctorsData = async () => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        const doctorsData = response.data.data;

        // Fetch leaves for each doctor and set them in the data
        for (const doctor of doctorsData) {
          const leavesResponse = await axios.get(
            `/api/admin/get-doctor-leaves/${doctor._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (leavesResponse.data.success) {
            doctor.leaves = leavesResponse.data.data;
          }
        }

        setDoctors(doctorsData);
        setLoading(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const openEditModal = (record) => {
    setEditingDoctor(record);
    setEditModalVisible(true);
    form.setFieldsValue(record);
  };

  const closeEditModal = () => {
    setEditingDoctor(null);
    setEditModalVisible(false);
    form.resetFields();
  };

  const updateDoctor = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/update-doctor/${editingDoctor._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
        closeEditModal();
      }
    } catch (error) {
      toast.error("Error updating doctor information");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          Dr. {record.firstName} {record.lastName}
        </span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      render: (text, record) => (
        <span className="text-capitalize">{record.specialization}</span>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Experience",
      dataIndex: "experience",
      render: (text, record) => <p>{record.experience} Years</p>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Break Time",
      dataIndex: "breakTime",
      render: (text, record) => {
        const breakTime = record.breakTime;
        if (breakTime === "30") {
          return <span className="text-capitalize">{breakTime} mins</span>;
        } else if (
          breakTime === "1" ||
          breakTime === "1.5" ||
          breakTime === "2"
        ) {
          return <span>{breakTime} Hour(s)</span>;
        } else {
          // Handle other cases if needed
          return <span className="text-capitalize">{breakTime} </span>;
        }
      },
    },
    {
      title: "Leaves",
      dataIndex: "leaves",
      render: (leaves, record) => (
        <div className="naz">
          {leaves && leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <div key={index}>
                <span>
                  Start Date: {moment(leave.startDate).format("DD-MM-YYYY")}
                </span>
                <br />
                <span>
                  End Date: {moment(leave.endDate).format("DD-MM-YYYY")}
                </span>
                <br />
              </div>
            ))
          ) : (
            <span>No Leaves Available</span>
          )}
        </div>
      ),
    },

    {
      title: "Clinic Fees",
      dataIndex: "feePerCunsultation",
      render: (number, record) => {
        return (
          <p className="font-weight-600 text-danger">
            {record.feePerCunsultation} AED
          </p>
        );
      },
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <p className="text-capitalize">{record.status}</p>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-between align-items-center gap-2">
          <button
            className="btn btn-success btn-sm "
            type="button"
            onClick={() => openAvailablityModal(record._id)}
          >
            Availablity
          </button>
          {(record.status === "pending" || record.status === "Pending") && (
            <button
              type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              approve
            </button>
          )}
          {(record.status === "Approved" || record.status === "approved") && (
            <button
              type="button"
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              block
            </button>
          )}
          {(record.status === "Blocked" || record.status === "blocked") && (
            <button
              type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              approve
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-sm text-capitalize"
            onClick={() => openEditModal(record)}
          >
            edit
          </button>
          <button
            className="btn btn-warning btn-sm "
            type="button"
            onClick={() => openLeaveModal(record)}
          >
            Set Leave
          </button>
        </div>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
  ];
  const customLoader = (
    <div style={{ textAlign: "center", margin: "50px auto" }}>
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />
        }
      />
      <p style={{ marginTop: "10px" }}>Loading...</p>
    </div>
  );
  console.log(doctors);
  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = doctors.filter((item) => {
      console.log(item);
      const itemDate = new Date(item?.createdAt);
      console.log(
        onlyDate.toDateString(),
        startDateObj.toDateString(),
        endDateObj.toDateString(),
        itemDate.toDateString()
      );
      if (filterType === "Date") {
        return itemDate.toDateString() === onlyDate.toDateString();
      } else {
        // Date range filter
        console.log(
          itemDate.toDateString(),
          startDateObj.toDateString(),
          endDateObj.toDateString()
        );

        return (
          itemDate.toDateString() >= startDateObj.toDateString() &&
          itemDate.toDateString() <= endDateObj.toDateString()
        );
      }
    });

    console.log(filtered);

    setFilteredData(filtered.length > 0 ? filtered : null);

    console.log(filtered.length > 0 ? filtered : null);

    setFilter(false);
  };

  const onChangeDate = (date, dateString) => {
    setOnlyDate(moment(dateString).format("LL"));

    console.log(moment(dateString).format("LL"));
  };

  const onChangeRange = (date, dateString) => {
    setStartDate(moment(dateString[0]).format("LL"));
    setEndDate(moment(dateString[1]).format("LL"));
    console.log(
      moment(dateString[0]).format("LL"),
      moment(dateString[1]).format("LL")
    );
  };

  const createPdfWithTable = async (data) => {
    const doc = new JsPDF();
    doc.setFontSize(30);
    doc.text(80, 20, "Payments");

    doc.setFontSize(20);

    const headers = [
      "Name",
      "Phone",
      "Specialization",
      "Experience",
      "Break Time",
      "Leaves",
      "Clinic Fees",
      "Created At",
      "Status",
    ];
    const datas = filteredData.map((item) => [
      ` Dr. ${item?.firstName} ${item?.lastName}`,
      item?.phoneNumber,
      item?.specialization,
      item?.experience,
      item?.breakTime,
      item?.leaves.map(
        (leave, index) =>
          `Start Date: ${moment(leave.startDate).format(
            "LL"
          )},  End Date: ${moment(leave.endDate).format("LL")}`
      ),
      item?.feePerCunsultation,
      moment(item?.createdAt).format("LL"),
      item?.status,
    ]);
    console.log(datas);

    doc.setFontSize(10);

    doc.autoTable({
      head: [headers],
      body: datas,
      theme: "striped",
      margin: { top: 30 },
    });

    const pdfBytes = doc.save("doctors.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "doctors.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
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

  const handleAvailiblitySubmit = async () => {
    const starttime = timeFormat(time?.starttime);
    const endtime = timeFormat(time?.endtime);
    try {
      console.log(starttime, endtime)
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/update-doctor/${doctorId}`,
        { starttime:starttime, endtime:endtime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
        closeEditModal();
      }
    } catch (error) {
      toast.error("Error updating doctor information");
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="page-title mb-0">Doctor List</h5>
        <a href="/admin/apply-doctor">
          <button className="btn btn-success " type="button">
            Add New Doctor
          </button>
        </a>
      </div>
      <hr />
      <div className="row">
        <div className="mb-2 col">
          <select
            className="form-control"
            id="break"
            name="break"
            value={filterType}
            onChange={handleFilterType}
          >
            <option defaultValue="">Select Filter...</option>
            <option value="Date">Date</option>
            <option value="Range">Range</option>
            {/* <option value="Weekly">Weekly</option>
              <option value="Montly">Montly</option> */}
          </select>
        </div>
        {filterType === "Range" && (
          <div className="mb-2 col">
            <RangePicker onChange={onChangeRange} style={{ width: "100%" }} />
          </div>
        )}
        {filterType === "Date" && (
          <div className="mb-2 col">
            <DatePicker
              onChange={onChangeDate}
              size="large"
              style={{ width: "100%" }}
            />
          </div>
        )}
        <div className="mt-1 col">
          <button
            type="submit"
            className="btn btn-success btn-sm me-3"
            onClick={handleFilter}
          >
            Filter
          </button>
          <button
            type="submit"
            className="btn btn-success btn-sm"
            onClick={createPdfWithTable}
            disabled={filter}
          >
            Export to PDF
          </button>
        </div>
      </div>
      {loading ? (
        customLoader // Use the custom loader
      ) : filteredData !== null ? (
        filteredData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            responsive={true}
            scroll={{ x: true }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={doctors}
            responsive={true}
            scroll={{ x: true }}
          />
        )
      ) : (
        <div className="text-center m-5">No result found</div>
      )}
      <Modal
        title="Doctor Availablity"
        visible={availableModalVisible}
        onCancel={closeAvailablityModal}
        footer={null}
        style={{ borderRadius: "6px" }}
        width={600}
      >
        <label>Select Time For Doctor Shift</label>
        <br />
        <TimePicker.RangePicker
          className="mt-3 w-100"
          format={"HH:mm"}
          onChange={onChange}
          required
        />
        <div className="d-flex justify-content-end  mb-3 mt-3">
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleAvailiblitySubmit()}
          >
            Submit
          </button>
        </div>
      </Modal>
      <Modal
        title="Edit Doctor"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        style={{ borderRadius: "6px" }}
        width={600}
      >
        <Form
          form={form}
          onFinish={updateDoctor}
          labelCol={{ span: 6 }} // Adjust the span value as needed
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: "Please enter Specialization" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience"
            rules={[
              { required: true, message: "Please enter year of experience" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="breakTime"
            label="Break Time"
            rules={[{ required: true, message: "Please select break time" }]}
          >
            <Select>
              <Select.Option value={30}>30 mins</Select.Option>
              <Select.Option value={45}>45 mins</Select.Option>
              <Select.Option value={1}>1 hour</Select.Option>
              <Select.Option value={1.5}>1.5 hours</Select.Option>
              <Select.Option value={2}>2 hours</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item labelAlign="right">
            <div className="text-center mt-2">
              <button
                type="submit"
                className="btn btn-primary text-right btn-sm"
              >
                Update Doctor Details
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Set Leave for Dr. ${leaveDoctor ? leaveDoctor.firstName : ""} ${
          leaveDoctor ? leaveDoctor.lastName : ""
        }`}
        visible={leaveModalVisible}
        onCancel={closeLeaveModal}
        width={800}
        className="d-flex justify-content-center align-items-center"
        footer={[
          <Button key="back" onClick={closeLeaveModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={leaveLoading}
            onClick={handleSetLeave}
          >
            Set Leave
          </Button>,
        ]}
      >
        <div className="d-lg-flex justify-content-between align-items-center gap-3">
          <p className="text-dark">
            Doctor ID: {leaveDoctor ? leaveDoctor._id : ""}
          </p>
          <p className="text-dark">
            Doctor Name:{" "}
            {leaveDoctor
              ? `${leaveDoctor.firstName} ${leaveDoctor.lastName}`
              : ""}
          </p>
        </div>
        <Form form={leaveForm} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
          <Form.Item
            form={leaveForm}
            name="doctorId"
            style={{ marginTop: "10px" }}
            label="Doctor Id"
            hidden
            initialValue={leaveDoctor ? leaveDoctor._id : ""} // Pre-fill the doctorId field
          >
            <Input />
          </Form.Item>
          <Form.Item
            form={leaveForm}
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            form={leaveForm}
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default DoctorsList;
