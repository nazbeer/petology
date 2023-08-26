import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";
import { Buffer } from 'buffer';
import logo from "../../images/logo-petology.png";
function ServiceList() {
  //const [Services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const getServicesData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-packs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getServicesData();
  }, []);
//   const renderImage = (record) => {
//     if (!record.image) {
//       // If no image is found, display the default logo
//       return <img src={logo}  className="petimg img-responsive" alt="Default Logo" />;
//     } else {
//       // If an image is found in the record, render the image
//       const imageUrl = base64ToDataUrl(record.image); // Convert base64 to data URL
//       return <img src={imageUrl}  className="petimg img-responsive" alt="Pet Image" style={{   borderRadius:'100%'}} />;
//     }
//   };

//   const base64ToDataUrl = (base64String) => {
//     return `http://localhost:5000/${base64String}.png`;
//   };
  const columns = [
    {
        title: "ID",
        dataIndex: "_id",
    },
    {
      title:"Service",
      dataIndex:"name",
      // render:(text, record)=>(
      //     <span className="d-flex justify-content-center">
      //         {/* <img src={base64ToDataUrl(record.image)} width="64px" height="64px" className="petimg img-responsive"/> */}
      //         {record.name}
      //     </span>
      // )
  }, 
 
    {
        title:"Sub Service",
        dataIndex:"subservice",

        render:(text, record) =>(
          <div>
          {services.map((service, index) => (
            <span key={index}>
               
                <p>{service.subservices.join(", ")}</p>
            </span>
        ))}
        </div>
        )
        // render:(text, record)=>(
        //     <span>
        //         {record.subservice}
        //     </span>
        // )
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
      <h4 className="page-header mb-0">Services &amp; Packages</h4>
     <a href="/admin/addservices" ><button className="btn btn-success btn-sm" type="button">Add New Service</button></a>

      </div>
      <hr />
      {/* <Table columns={columns} dataSource={services}/> */}
      <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">List of All Services and its packages</h5>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Sub Services & Packages</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => (
                                <tr key={index}>
                                    <td>{service.name}</td>
                                    <td>{service.subservices.join(", ")}</td>
                                    <td><div className="d-flex justify-content-evenly">
            <button type="button" className="btn btn-success btn-sm cusrsor-pointer"><i className="ri-eye-line"></i></button>
            <button type="button" className="btn btn-warning btn-sm cusrsor-pointer"><i className="ri-edit-line"></i></button>
            <button type="button" className="btn btn-danger  btn-sm cusrsor-pointer"><i className="ri-delete-bin-line"></i></button>

          </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
      
    </Layout>
  );
}

export default ServiceList;
