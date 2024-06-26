import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import { Buffer } from "buffer";

function Petlist() {
  const [pets, setPets] = useState([]);
  const dispatch = useDispatch();

  const getPetsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/pet/get-pets-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setPets(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getPetsData();
  }, []);

  const base64ToDataUrl = (base64String) => {
    const url = `http://localhost:5000/${base64String}`;
    const mainPath = url.replace(/^uploads\\/, "").toLowerCase();
    console.log(mainPath);

    return mainPath;
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Pet Image",
      dataIndex: "image",
      render: (text, record) => (
        <span>
          <img
            src={base64ToDataUrl(record.image)}
            width="64px"
            height="64px"
            className="img-responsive"
          />
        </span>
      ),
    },
    {
      title: "Pet",
      dataIndex: "pet",
    },
    {
      title: "Breed",
      dataIndex: "breed",
      render: (text, record) => <span>{record.breed}</span>,
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (text, record) => <span>{record.size}</span>,
    },
  ];

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="">Pet List</h3>
        <a href="/user/addpet">
          <button className="btn btn-success " type="button">
            Add New Pet
          </button>
        </a>
      </div>
      <hr />
      <Table
        columns={columns}
        dataSource={pets}
        responsive={true}
        scroll={{ x: true }}
      />
    </Layout>
  );
}

export default Petlist;
