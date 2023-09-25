import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Modal, Form, Input, DatePicker, Button, Table, Radio } from "antd";
import moment from "moment";

import { PDFDocument, rgb } from "pdf-lib";
import { pdfjs } from "react-pdf";
import opentype from "opentype.js";
import * as fontkit from "fontkit";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
  const navigate = useNavigate();

  const [font, setFonts] = useState("");
  const [watermarkImage, setWatermarkImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch("../logo-petology.png");
        const blob = await response.blob();
        setWatermarkImage(blob);
      } catch (error) {
        console.error("Error loading watermark image:", error);
      }
    };
    loadImage();

    async function customFont() {
      // Load your custom font file
      const fontprescription = await fetch(
        "../fonts/Outfit/static/Outfit-Regular.ttf"
      ).then((res) => res.arrayBuffer());
      const font = await opentype.parse(fontprescription);
      setFonts(font);
    }
    customFont();
  }, []);

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
          Dr. {record?.doctor?.firstName} {record?.doctor?.lastName}
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
      title: "Prescription",
      dataIndex: "prescriptions",
      render: (text, record) => (
        <div>
          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => showPrescriptionModal(record._id)}
          >
            View
          </button>
        </div>
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
        </div>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (openDate && date) {
      console.log(date?.format("YYYY-MM-DD"));
      newAppointment.date = date?.format("YYYY-MM-DD");
      newAppointment.followUp = true;
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
      navigate("/user/booking");
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

  const createPDF = async () => {
    try {
      const textFields = [
        {
          label: "Appointment ID",
          value: prescription?.appointmentId,
          fontSize: 14,
        },
        {
          label: "User Name",
          value: prescription?.userName,
          fontSize: 14,
        },
        {
          label: "Doctor",
          value: prescription?.doctorName,
          fontSize: 14,
        },
        {
          label: "Pet",
          value: prescription?.pet,
          fontSize: 14,
        },
        {
          label: "Prescription",
          value: prescription?.prescription,
          fontSize: 14,
        },

        {
          label: "Description",
          value: prescription?.description,
          fontSize: 14,
        },
      ];
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const customFont = await pdfDoc.embedFont(font.toArrayBuffer());
      const page = pdfDoc.addPage();
      page.setFont(customFont);

      const image = await pdfDoc.embedPng(await watermarkImage.arrayBuffer());

      // Calculate the center coordinates
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const imageWidth = 400; // Adjust the image width as needed
      const imageHeight = 400; // Adjust the image height as needed
      const centerX = (pageWidth - imageWidth) / 2;
      const centerY = (pageHeight - imageHeight) / 2;

      // Define watermark position, size, and opacity
      const watermarkOptions = {
        x: centerX,
        y: centerY,
        width: imageWidth,
        height: imageHeight,
        opacity: 0.5, // Adjust the opacity as needed
      };

      page.drawImage(image, watermarkOptions);

      page.drawText("Prescription Details", {
        x: centerX + 70, // Adjust the X position as needed
        y: pageHeight - 100, // Adjust the Y position as needed
        size: 30,
        color: rgb(0, 0.5, 0),
      });

      textFields.forEach((text, index) => {
        const textY = pageHeight - 250 - index * 30; // Adjust Y position for each text
        page.drawText(text?.label, {
          x: 50, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText(text?.value ? text?.value?.toString() : "", {
          x: 400, // Adjust the X position as needed
          y: textY - (text?.margin ? text?.margin : 0),
          size: text.fontSize,
          color: rgb(0, 0, 0),
          right: 1,
        });
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${prescription?.appointmentId}.pdf`;
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating watermark PDF:", error);
    }
  };

  return (
    <>
      <div className="d-lg-flex justify-align-between align-items-center">
        <h4 className="page-title">My Appointments</h4>
        {/* <Input placeholder="Search"/> */}
      </div>

      <hr />
      <Table
        columns={columns}
        dataSource={appointments?.data}
        responsive={true}
        scroll={{ x: true }}
      />

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
            <div className="row">
              <div className="col">
                <Form.Item label="Appointment ID" name="appointmentId">
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label="User"
                  name="userName"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Form.Item label="Doctor" name="doctorName">
                  <Input disabled />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item label="Pet" name="pet">
                  <Input value="Dog" disabled />
                </Form.Item>
              </div>
            </div>
            <Form.Item label="Pet" name="petId" hidden>
              <Input disabled />
            </Form.Item>
            <div className="row">
              <div className="col">
                <Form.Item
                  label="Prescription"
                  name="prescription"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea disabled />
                </Form.Item>
              </div>
              <div className="col">
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea disabled />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <div className="d-flex row">
                <div className="col-11">
                  <Radio.Group name="radiogroup" defaultValue={1}>
                    <Radio value={1} onChange={handleNext}>
                      {" "}
                      New Appointment
                    </Radio>
                    <Radio value={2} onChange={handleFollow}>
                      Follow Up
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="col-1 " style={{ width: 29, height: 20 }}>
                  <button
                    type="button"
                    className="btn btn-success btn-sm cusrsor-pointer"
                    onClick={createPDF}
                  >
                    <i className="ri-download-line"></i>
                  </button>
                </div>
              </div>
            </Form.Item>

            {openDate ? (
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
            ) : (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Book Now
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default MobVeti;
