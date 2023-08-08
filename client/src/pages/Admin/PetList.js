import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import { Buffer } from 'buffer';
import logo from "../../images/logo-petology.png";
function Petlist() {
  const [pets, setPets] = useState([]);
  const dispatch = useDispatch();
  
  const getPetsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/pet/get-all-pets", {
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
  const renderImage = (record) => {
    if (!record.image) {
      // If no image is found, display the default logo
      return <img src={logo}  className="petimg img-responsive" alt="Default Logo" />;
    } else {
      // If an image is found in the record, render the image
      const imageUrl = base64ToDataUrl(record.image); // Convert base64 to data URL
      return <img src={imageUrl}  className="petimg img-responsive" alt="Pet Image" style={{   borderRadius:'100%'}} />;
    }
  };

  const base64ToDataUrl = (base64String) => {
    return `http://localhost:5000/${base64String}.png`;
  };
  const columns = [
    {
        title: "ID",
        dataIndex: "_id",
    },
    {
      title:"Pet Image",
      dataIndex:"image",
      render:(text, record)=>(
          <span className="d-flex justify-content-center">
              {/* <img src={base64ToDataUrl(record.image)} width="64px" height="64px" className="petimg img-responsive"/> */}
              {renderImage(record)}
          </span>
      )
  }, 
    {
        title:"Pet",
        dataIndex:"pet",
        
    },
    {
        title:"Breed",
        dataIndex:"breed",
        render:(text, record)=>(
            <span>
                {record.breed}
            </span>
        )
    }, 
    {
        title:"Size",
        dataIndex:"size",
        render:(text, record)=>(
            <span>
                {record.size}
            </span>
        )
    }, 
    {
      title:"Dimension",
      dataIndex:"dimension",
      render:(text, record)=>(
          <span>
              {record.dimension}
          </span>
      )
  }, 
  
      {
        title: "Actions",
        dataIndex: "status",
        render: (text, record) => (
          <div className="d-flex justify-content-evenly">
            <button type="button" className="btn btn-success btn-sm cusrsor-pointer"><i className="ri-eye-line"></i></button>
            <button type="button" className="btn btn-warning btn-sm cusrsor-pointer"><i className="ri-edit-line"></i></button>
            <button type="button" className="btn btn-danger  btn-sm cusrsor-pointer"><i className="ri-flag-line"></i></button>

          </div>
        ),
      },
    
    // {
    //   title: "Date & Time",
    //   dataIndex: "createdAt",
    //   render: (text, record) => (
    //     <span>
    //       {moment(record.date).format("DD-MM-YYYY")} {moment(record.time).format("HH:mm")}
    //     </span>
    //   ),
    // },
    
  ];

  return (
    <Layout>
    <div className="d-flex justify-content-between align-items-center">
      <h4 className="page-header mb-0">Pet List</h4>
     <a href="/admin/addpet" ><button className="btn btn-success btn-sm" type="button">Add New Pet</button></a>

      </div>
      <hr />
      <Table columns={columns} dataSource={pets}/>
    </Layout>
  );
}

export default Petlist;
