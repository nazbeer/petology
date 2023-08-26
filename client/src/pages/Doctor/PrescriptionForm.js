import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

const PrescriptionForm = ({ selectedAppointmentId, onClose, appointmentData }) => {
    const [form] = Form.useForm();
  
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      appointmentId: selectedAppointmentId,
      userId: appointmentData?.userInfo?.userId,
      userName : appointmentData?.userInfo?.name,
      petName: appointmentData?.petInfo?.name,
      petId: appointmentData?.petInfo?._id,
      doctorId: appointmentData?.doctorInfo?.firstName + " " + appointmentData?.doctorInfo?.lastName ,
      
    });
  }, [selectedAppointmentId, appointmentData]);
 // console.log(appointmentData?.petInfo);
//   useEffect(() => {
//     if (selectedAppointmentId) {
//       axios
//         .get(`/api/admin/get-appointment-by-id/${selectedAppointmentId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })
//         .then((response) => {
//           if (response.data.success) {
//             setSelectedAppointment(response.data.data);
//           }
//         });
//     }

   
//   }, [selectedAppointmentId]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "/api/doctor/addprescription",
        values, 
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      console.log('Response', response );
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
      <Form.Item label="Appointment ID" name="appointmentId">
        <Input disabled />
      </Form.Item>

      <Form.Item label="User" name="userId" hidden>
        <Input disabled />
      </Form.Item>

      <Form.Item label="User" name="userName" rules={[{ required: true }]}>
        <Input disabled />
      </Form.Item>

      <Form.Item label="Pet" name="petName" >
        <Input disabled />
      </Form.Item>

      <Form.Item label="Pet" name="petId" hidden>
        <Input disabled />
      </Form.Item>

      <Form.Item label="Doctor" name="doctorId" rules={[{ required: true }]}>
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
