import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

const PrescriptionForm = ({
  selectedAppointmentId,
  onClose,
  appointmentData,
}) => {
  const [form] = Form.useForm();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      appointmentId: selectedAppointmentId,
      customID: appointmentData?.customId,
      userId: appointmentData?.user?.userId,
      userName: appointmentData?.user?.name,
      petName: appointmentData?.user?.pet,
      petId: appointmentData?.petInfo?.pet,
      doctorId: `${appointmentData?.doctor?.firstName} ${appointmentData?.doctor?.lastName}`,
      doctorName: `${appointmentData?.doctorInfo?.firstName} ${appointmentData?.doctorInfo?.lastName}`,
    });
  }, [selectedAppointmentId, appointmentData]);

  // console.log(appointmentData?.petInfo);
  useEffect(() => {
    if (selectedAppointmentId) {
      axios
        .get(`/api/doctor/get-appointment-by-id/${selectedAppointmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setSelectedAppointment(response.data.data);
          }
        });
    }
  }, [selectedAppointmentId]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/doctor/addprescription", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Response", response);
      if (response.data.success) {
        toast.success("Prescription added successfully");
        //form.resetFields();
        // onClose();
      }
    } catch (error) {
      toast.error("Error adding prescription");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" width={800}>
      <Form.Item label="Appointment ID" name="customID">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Appointment ID" name="appointmentId" hidden>
        <Input disabled />
      </Form.Item>
      <Form.Item label="User" name="userId" hidden>
        <Input disabled />
      </Form.Item>

      <Form.Item label="User" name="userName" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>

      <Form.Item label="Pet" name="petName">
        <Input value="Dog" placeholder="Dog" disabled />
      </Form.Item>

      <Form.Item label="Pet" name="petId" hidden>
        <Input disabled />
      </Form.Item>

      {/* <Form.Item label="Doctor" name="doctorId" >
        <Input disabled />
      </Form.Item> */}
      <Form.Item label="Doctor" name="doctorId">
        <Input value={form.getFieldValue("doctorId")} disabled />
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

      <Form.Item label="Next Appointment Date" name="ndate">
        <DatePicker
          style={{ width: "100%" }}
          disabledDate={(current) => {
            return moment().add(-1, "days") >= current;
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button
          className="btn btn-success btn-sm"
          type="primary"
          htmlType="submit"
        >
          Add Prescription
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PrescriptionForm;
