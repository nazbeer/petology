import { Select, Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import React, {useState} from "react";

const { Option } = Select;

function DoctorForm({ onFinish, initivalValues }) {
  const [shift, setShift] = useState('day');
  const handleShiftChange = (value) => {
    setShift(value);
  };

  // const handleTimeChange = (time, timeString) => {
  //   if (time.length === 2) {
  //     setStartTime(moment(time[0]));
  //     setEndTime(moment(time[1]));
  //   }
  // };
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      // initialValues={{
      //   ...initivalValues,
      //   ...(initivalValues && {
      //     timings: [
      //       moment(initivalValues?.timings[0], "HH:mm"),
      //       moment(initivalValues?.timings[1], "HH:mm"),
      //     ],
      //   }),
      // }}
    >
      <h1 className="card-title mt-3">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            
            label="Website"
            name="website"
            rules={[{ required: false }]}
          >
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
          
            label="Consultation Fee"
            name="feePerCunsultation"
        
          >
            <Input placeholder="Consultation Fee" type="number" defaultValue={80} />
          </Form.Item>
        </Col>
    
        <Col span={8} xs={24} sm={24} lg={8}>
        
            <Form.Item required label="Shift" name="shift" rules={[{ required: true }]}>
          <Select onChange={handleShiftChange} >
            <Option value="day">Day Shift</Option>
            <Option value="night">Night Shift</Option>
          </Select>
        </Form.Item>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
