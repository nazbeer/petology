import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import PrescriptionForm from "../Doctor/PrescriptionForm";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import moment from "moment";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/doctor/appointments-by-doctor-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const showAddPrescriptionModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setModalVisible(true);
  };

  const hideAddPrescriptionModal = () => {
    setSelectedAppointmentId(null);
    setModalVisible(false);
  };

  const showAddHistoryModal = (userId) => {
    console.log(userId);
    setSelectedUserId(userId);
    setHistoryModalVisible(true);
    fetchHistoryRecords(userId);
  };

  const hideHistoryModal = () => {
    setSelectedUserId(null);
    setHistoryModalVisible(false);
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      toast.error("Error changing doctor account status");
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "customID",
      render: (text, record) => <span>{record?.customId}</span>,
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record?.user?.name}</span>,
    },

    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record?.user?.mobile}</span>,
    },
    {
      title: "Pet",
      dataIndex: "pet",
      render: (text, record) => (
        <span className="text-capitalize">
          {record?.pet} - {record?.size} - {record?.breed}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record?.date).format("DD MMM, YYYY")}
          {" | "}
          {record.time}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span className="text-capitalize">{record?.status}</span>
      ),
    },
    {
      title: "History",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evently gap-2 align-items-center">
          <Button
            type="primary"
            onClick={() => showAddHistoryModal(record?.userId)}
          >
            View
          </Button>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-evently gap-2 align-items-center">
          {record.status === "pending" ||
            (record.status === "approved" && (
              <div className="d-flex gap-2">
                {/* <Button type="success"  onClick={() => changeAppointmentStatus(record, "approved")}> Approve</Button>
                 */}

                <Button
                  type="danger"
                  onClick={() => changeAppointmentStatus(record, "rejected")}
                >
                  {" "}
                  Reject
                </Button>
              </div>
            ))}
          <Button
            type="primary"
            onClick={() => showAddPrescriptionModal(record?._id)}
          >
            Add Prescription
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getAppointmentsData();
  }, []);
  const [openappointments, setopenAppointments] = useState([]);
  const dispatcha = useDispatch();
  const getopenAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-openappointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatcha(hideLoading());
      if (response.data.success) {
        setopenAppointments(response.data.data);
      }
    } catch (error) {
      dispatcha(hideLoading());
    }
  };
  const opencolumns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Service Needed",
      dataIndex: "service",
      render: (text, record) => <span>{record.service}</span>,
    },
    {
      title: "Pet",
      dataIndex: "pet",
      render: (text, record) => <span>{record.pet}</span>,
    },
    {
      title: "Parent Name",
      dataIndex: "parent",
      render: (text, record) => (
        <span>
          {record.firstname} {record.lastname}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD MMM, YYYY")}
          {" | "}
          {record.time}
        </span>
      ),
    },

    {
      title: "Email",
      dataIndex: "Email",
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      render: (text, record) => <span>{record?.mobile}</span>,
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
        <div className="d-flex justify-content-evently gap-2 align-items-center">
          {record.status === "pending" ||
            (record.status === "approved" && (
              <div className="d-flex gap-2">
                <Button
                  type="success"
                  onClick={() => changeAppointmentStatus(record, "approved")}
                >
                  {" "}
                  Approve
                </Button>

                <Button
                  type="danger"
                  onClick={() => changeAppointmentStatus(record, "rejected")}
                >
                  {" "}
                  Reject
                </Button>
              </div>
            ))}
          <Button type="primary" onClick={showAddPrescriptionModal}>
            Add Prescription
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getopenAppointmentsData();
  }, []);
  const fetchHistoryRecords = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/history/${userId}`);
      if (response.data.success) {
        setHistoryRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching history records:", error);
    }
  };

  const renderFile = (path) => {
    const ext = path.split(".").pop().toLowerCase();
    const mainPath = path.replace(/^uploads\\/, "").toLowerCase();
    console.log(path);
    const file = `http://localhost:5000/${mainPath}`;
    console.log(file);
    // If it's an image
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return (
        <img
          src={file}
          alt="Uploaded"
          style={{ width: "100px", height: "auto" }}
        />
      );
    }
    // If it's a PDF
    if (ext === "pdf") {
      return <iframe src={file} width="100px" height="100px"></iframe>;
    }
    // For .doc or .docx
    if (["doc", "docx"].includes(ext)) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${file}&embedded=true`}
          width="100px"
          height="100px"
          frameBorder="0"
        ></iframe>
      );
    }
    // Add other file types if needed
    //  console.log(file);
    return (
      <a href={file} target="_blank" rel="noreferrer">
        Open File
      </a>
    );
  };
  const historyColumns = [
    // Define columns for the history records table
    // You can have columns like "Date", "Description", "Actions", etc.
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Patient History",
      dataIndex: "documentPath",
      render: (path) => renderFile(selectedUserId),
    },
  ];
  return (
    <Layout>
      <div>
        <h6 className="page-header">Appointments</h6>
        <hr />
        <Table
          columns={columns}
          dataSource={appointments}
          responsive={true}
          scroll={{ x: true }}
        />

        <Modal
          title="Add Prescription"
          visible={modalVisible}
          onCancel={hideAddPrescriptionModal}
          footer={null}
          width={700}
        >
          {selectedAppointmentId && (
            <PrescriptionForm
              selectedAppointmentId={selectedAppointmentId}
              onClose={hideAddPrescriptionModal}
              appointmentData={appointments.find(
                (appointment) => appointment._id === selectedAppointmentId
              )}
            />
          )}
        </Modal>

        <Modal
          title="History"
          visible={historyModalVisible}
          onCancel={hideHistoryModal}
          footer={null}
          width={700}
        >
          <Table
            columns={historyColumns}
            dataSource={historyRecords}
            rowKey="_id"
            pagination={false}
            style={{ padding: "0px" }}
          />
        </Modal>
      </div>
      <div className="d-none">
        <h6 className="page-title">Open Appointments</h6>
        <hr />
        <Table
          columns={opencolumns}
          dataSource={openappointments}
          responsive={true}
          scroll={{ x: true }}
        />
      </div>
    </Layout>
  );
}

export default DoctorAppointments;
