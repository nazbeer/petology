import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const DoctorsPetlist = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const [date, setDate] = useState("");

  const [filteredlist, setFilteredlist] = useState([]); 
  const [loading, setLoading] = useState(true);

  const handleFilter = () => {
    // You can adjust the filter criteria as needed
    if (date) {
      const filteredItems = pets.filter((item) => {
        if (item.createdAt) {
          const itemDate = item.createdAt.substring(0, 10);
          console.log(itemDate);
          return itemDate === date;
        }
      });
      console.log(filteredItems);

      setFilteredlist(filteredItems.length > 0 ? filteredItems : null);
    }
  };

  const handleChange = (e) => {
    const date = e.target.value;
    console.log(date);
    setDate(date);
  };
  const getData = async () => {
    try {
      setLoading(true);
      //     dispatch(showLoading())
      const response = await axios.get("/api/pet/get-all-pets", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      //    dispatch(hideLoading())
      if (response.data.success) {
        console.log(response.data.success);

        setPets(response.data.data);
        setLoading(false);
        // const approvedD = response.data;
        // setApprovedDoctors(approvedD);
      }
    } catch (error) {
      setLoading(false);
      //       dispatch(hideLoading())
    }
  };

  const columns = [
    {
      title: "Pet",
      dataIndex: "pet",
      render: (text, record) => <span>{record?.pet}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "PetName",
      dataIndex: "petName",
      render: (text, record) => <span>{record?.petName}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <span>{record?.user?.name}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "size",
      dataIndex: "size",
      render: (text, record) => <span>{record?.size}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },

    {
      title: "breed",
      dataIndex: "breed",
      render: (text, record) => <span>{record?.breed}</span>,
      responsive: ["xs", "md", "sm", "lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex justify-content-around align-items-center gap-2">
          <button
            className="btn btn-success btn-sm"
            type="button"
            onClick={() => navigate(`/book-appointment/${record?._id}`)}
          >
            <i className="ri-eye-line"></i>
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

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="p-2">
      <div>
        <h3>Pets</h3>
      </div>
      <div className="row">
        <div class="row">
          <div class="col-8">
            <div className="mb-2">
              {/* <label htmlFor="date">Date:</label> */}
              <input
                className="form-control"
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="col mb-2">
            <button className="btn btn-success" onClick={handleFilter}>
              Filter
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        customLoader // Use the custom loader
      ) : filteredlist !== null ? (
        filteredlist.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredlist}
            responsive={true}
            scroll={{ x: true }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={pets}
            responsive={true}
            scroll={{ x: true }}
          />
        )
      ) : (
        <div className="text-center m-5">No result found</div>
      )}
      {/* <div className="table-responsive-sm">
        <table className="table table-striped">
          <thead>
            <tr>
              <td>Pet</td>
              <td>Size</td>
              <td>Breed</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {filteredlist !== null ? (
              filteredlist.length > 0 ? (
                filteredlist.map((pet, key) => (
                  <tr key={pet.key}>
                    <td>{pet.pet}</td>
                    <td>{pet.size}</td>
                    <td>{pet.breed}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        type="button"
                        onClick={() => navigate(`/book-appointment/${pet._id}`)}
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                pets.map((pet, key) => (
                  <tr key={pet.key}>
                    <td>{pet.pet}</td>
                    <td>{pet.size}</td>
                    <td>{pet.breed}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        type="button"
                        onClick={() => navigate(`/book-appointment/${pet._id}`)}
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <div>No result found</div>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default DoctorsPetlist;
