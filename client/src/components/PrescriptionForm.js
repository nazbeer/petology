import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import { toast } from "react-hot-toast";

const PrescriptionForm = () => {
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch user details
    axios.get("/api/user/get-all-approved-users").then((response) => {
      if (response.data.success) {
        setUsers(response.data.data);
      }
    });

    // Fetch pet details
    axios.get("/api/pets").then((response) => {
      if (response.data.success) {
        setPets(response.data.data);
      }
    });

    // Fetch doctor details
    axios.get("/api/doctors").then((response) => {
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    });

    // Fetch appointment details
    axios.get("/api/appointments").then((response) => {
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/prescriptions", values);
      if (response.data.success) {
        toast.success("Prescription added successfully");
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error adding prescription");
    }
  };

  return (
   
    <Form form={form} onFinish={handleSubmit} layout="vertical" width={800}>
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
              {doctor.doctorInfo.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Appointment" name="appointmentId" rules={[{ required: true }]}>
        <Select placeholder="Select Appointment">
          {appointments.map((appointment) => (
            <Select.Option key={appointment._id} value={appointment._id}>
              {appointment.date} - {appointment.time}
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
        <TimePicker style={{ width: "100%" }} />
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
