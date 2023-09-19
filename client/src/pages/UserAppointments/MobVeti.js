import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Modal, Form, Input, DatePicker, Button, Table, Radio } from "antd";
import moment from "moment";

function MobVeti() {
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const [form] = Form.useForm();
  const [prescription, setPrescription] = useState(null);
  const [date, setDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const [newAppointment, setnewAppointments] = useState({});

  const dispatch = useDispatch();

  const handleNext = () => {
    setOpenDate(false);
  };

  const handleFollow = () => {
    setOpenDate(true);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/user/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        setCancelledAppointments((prevAppointments) => [
          ...prevAppointments,
          appointmentId,
        ]);
        getAppointmentsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error canceling appointment");
    }
  };

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/user/appointments/mobvet`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("response", response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data); // Set appointments to response.data.data
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getPrescriptionsData = async (id) => {
    console.log(localStorage.getItem("token"));
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-prescription-by-id",
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setPrescription(response.data.data);
        setnewAppointments(response.data.data.appointmentData);
        console.log(response.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const handleCloseModal = () => {
    setPrescription(null);
    setShowModal(false);
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      appointmentId: prescription?.appointmentId,
      userName: prescription?.userName,
      pet: prescription?.pet,
      doctorName: prescription?.doctorName,
      prescription: prescription?.prescription,
      description: prescription?.description,
    });
  }, [prescription, form]);

  const columns = [
    {
      title: "ID",
      dataIndex: "customId",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          Dr. {record.doctor.firstName} {record.doctor.lastName}
        </span>
      ),
    },
    {
      title: "Service",
      dataIndex: "service",
      render: (text, record) => (
        <span className="text-capitalize">{record.service}</span>
      ),
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-capitalize">{record.user.name}</span>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => (
        <span className="text-capitalize">{record.user.mobile}</span>
      ),
    },
    {
      title: "Pet",
      dataIndex: "pet",
      render: (text, record) => (
        <span className="text-capitalize">
          {record.pet} - {record.size} - {record.breed}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "timing",
      render: (text, record) => (
        <span className="text-capitalize">
          {moment(record.date).format("D MMM, YYYY")}| {record.time}{" "}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record.status}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => cancelAppointment(record._id)}
            disabled={cancelledAppointments.includes(record._id)}
          >
            {cancelledAppointments.includes(record._id)
              ? "Cancelled"
              : "Cancel"}
          </button>

          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => showPrescriptionModal(record._id)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (openDate && date) {
      console.log(date?.format("YYYY-MM-DD"));
      newAppointment.date = date?.format("YYYY-MM-DD");
      newAppointment.followUp = true
      console.log(newAppointment);
      try {
        const response = await axios.post(
          "/api/user/user-book-appointment",
          newAppointment,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error in booking appointment.");
      }
    } else {
      setDate("");
    }
  };

  const showPrescriptionModal = (appointmentId) => {
    getPrescriptionsData(appointmentId);
    setShowModal(true);
  };

  const hidePrescriptionModal = () => {
    setPrescription(null);
    setShowModal(false);
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <>
      <div className="d-lg-flex justify-align-between align-items-center">
        <h4 className="page-title">My Appointments</h4>
        {/* <Input placeholder="Search"/> */}
      </div>

      <hr />
      <Table columns={columns} dataSource={appointments.data} />

      <Modal
        title="View Prescription"
        open={showModal}
        onCancel={hidePrescriptionModal}
        footer={null}
        width={700}
      >
        <div className="col-md-12 ">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            width={800}
          >
            <Form.Item label="Appointment ID" name="appointmentId">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="User"
              name="userName"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item label="Doctor" name="doctorName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Pet" name="pet">
              <Input value="Dog" disabled />
            </Form.Item>

            <Form.Item label="Pet" name="petId" hidden>
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Prescription"
              name="prescription"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={1} onChange={handleNext}>
                  {" "}
                  New Appointment
                </Radio>
                <Radio value={2} onChange={handleFollow}>
                  Follow Up
                </Radio>
              </Radio.Group>
            </Form.Item>

            {openDate && (
              <div>
                <Form.Item label="Next Appointment Date" name="ndate">
                  <DatePicker
                    style={{ width: "100%" }}
                    onChange={setDate}
                    disabledDate={(current) => {
                      return (
                        moment().add(-1, "days") >= current
                        // || moment().add(1, "month") <= current
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add Appointment
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default MobVeti;
