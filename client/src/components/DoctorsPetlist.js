import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorsPetlist = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const [date, setDate] = useState('');

  const [filteredlist, setFilteredlist] = useState([]); // Initially, it's the same as the initial list

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
        // const approvedD = response.data;
        // setApprovedDoctors(approvedD);
      }
    } catch (error) {
      //       dispatch(hideLoading())
    }
  };

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
      <div className="table-responsive-sm">
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
            { filteredlist !== null ? (filteredlist.length > 0
              ? filteredlist.map((pet, key) => (
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
                 
                )) : (pets.map((pet, key) => (
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
                ))))
              :  <div>No result found</div>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsPetlist;
