import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "./Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
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

const GroomerList = () => {
  const { RangePicker } = DatePicker;

  const [time, setTime] = useState({
    starttime: "",
    endtime: "",
  });
  const dispatch = useDispatch();
  const [groomer, setGroomer] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filter, setFilter] = useState(true);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState("");
  let [onlyDate, setOnlyDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [editingGroomer, setEditingGroomer] = useState([]);

  const handleFilterType = (event) => {
    console.log(event.target.value);
    setFilterType(event.target.value);
  };

  const handleFilter = () => {
    onlyDate = new Date(onlyDate);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const filtered = groomer.filter((item) => {
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

    const headers = ["Name", "Email", "Phone", "Created At", "Status"];
    const datas = filteredData.map((item) => [
      item?.name,
      item?.email,
      item?.mobile,
      item?.createdAt,
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

    const pdfBytes = doc.save("groomer.pdf");

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "groomer.pdf";
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  const openEditModal = (record) => {
    setEditingGroomer(record);
    setEditModalVisible(true);
    form.setFieldsValue(record);
  };

  const closeEditModal = () => {
    setEditingGroomer(null);
    setEditModalVisible(false);
    form.resetFields();
  };

  const getGroomersData = async () => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-groomer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setGroomer(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
    }
  };

  const changeGroomerStatus = async (record, status) => {
    console.log(record, status);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-groomer-status",
        { groomerId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getGroomersData();
      }
    } catch (error) {
      toast.error("Error changing groomer account status");
      dispatch(hideLoading());
    }
  };
  const updateGroomer = async (values) => {
    console.log(values, editingGroomer);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `/api/admin/update-groomer/${editingGroomer._id}`,
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
        getGroomersData();
        closeEditModal();
      }
    } catch (error) {
      toast.error("Error updating groomer information");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <span>{record?.name}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => <span>{record?.email}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record?.mobile}</span>,
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
        <p className="text-capitalize">{record?.status}</p>
      ),
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-around align-items-center gap-2">
          {(record.status === "pending" || record.status === "Pending") && (
            <button
              type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeGroomerStatus(record, "approved")}
            >
              approve
            </button>
          )}
          {(record.status === "Approved" || record.status === "approved") && (
            <button
              type="button"
              className="btn btn-danger btn-sm text-capitalize"
              onClick={() => changeGroomerStatus(record, "blocked")}
            >
              block
            </button>
          )}
          {(record.status === "Blocked" || record.status === "blocked") && (
            <button
              type="button"
              className="btn btn-warning btn-sm text-capitalize"
              onClick={() => changeGroomerStatus(record, "approved")}
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
  console.log(groomer);

  useEffect(() => {
    getGroomersData();
  }, []);
  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="page-title mb-0">Groomer List</h5>
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
              dataSource={groomer}
              responsive={true}
              scroll={{ x: true }}
            />
          )
        ) : (
          <div className="text-center m-5">No result found</div>
        )}
      </div>
      <Modal
        title="Edit Groomer"
        visible={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        style={{ borderRadius: "6px" }}
        width={600}
      >
        <Form
          form={form}
          onFinish={updateGroomer}
          labelCol={{ span: 6 }} // Adjust the span value as needed
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item labelAlign="right">
            <div className="text-center mt-2">
              <button
                type="submit"
                className="btn btn-primary text-right btn-sm"
              >
                Update Groomer Details
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default GroomerList;
