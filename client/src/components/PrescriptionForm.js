import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import { toast } from "react-hot-toast";
import moment from 'moment';

const PrescriptionForm = ({ selectedAppointmentId, onClose }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedAppointmentId) {
      axios
        .get(`/api/doctor/get-appointment-by-id/${selectedAppointmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setSelectedAppointment(response.data.data);
          }
        });
    }

    axios.get("/api/doctors").then((response) => {
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    });

    axios.get(`/api/doctor/get-all-users/${selectedAppointmentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.data.success) {
        setUsers(response.data.data);
      }
    });

    axios.get("/api/pet/get-all-pets", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.data.success) {
        setPets(response.data.data);
      }
    });
  }, [selectedAppointmentId]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "/api/prescriptions/addprescription",
        values
      );
      if (response.data.success) {
        toast.success("Prescription added successfully");
        form.resetFields();
        onClose();
      }
    } catch (error) {
      toast.error("Error adding prescription");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" width={800}>
      <Form.Item label="Appointment ID" name="appointmentId">
        <Input value={selectedAppointment} disabled />
      </Form.Item>

      <Form.Item label="User" name="userId" rules={[{ required: true }]}>
        <Select placeholder="Select User">
          {users.map((user) => (
            <Select.Option key={user._id} value={user._id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Pet" name="petId" rules={[{ required: true }]}>
        <Select placeholder="Select Pet">
          {pets.map((pet) => (
            <Select.Option key={pet._id} value={pet._id}>
              {pet.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Doctor" name="doctorId" rules={[{ required: true }]}>
        <Select placeholder="Select Doctor">
          {doctors.map((doctor) => (
            <Select.Option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Prescription" name="prescription" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Description" name="description" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Next Appointment Date" name="ndate">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Next Appointment Time" name="ntime">
        <TimePicker style={{ width: "100%" }} format="HH:mm" showNow={false} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Prescription
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PrescriptionForm;