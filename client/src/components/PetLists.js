import React from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
function PetLists({ pets }) {
  const navigate = useNavigate();
  return (
  <>
    <div className="mb-4">
    
          <tr>
            <td>
            {pets._id}
            </td>
            <td>
            {pets.pet}
            </td>
            <td>
            <button className="btn btn-success btn-sm" type="button" onClick={() => navigate(`/book-appointment/${pets._id}`)}>View Details</button>
            </td>
          </tr>
      
    </div>
    {/* <div
      className="card cursor-pointer d-none mb-4"
      onClick={() => navigate(`/book-appointment/${pets._id}`)}
    >
      <div className="card-header font-weight-600">  {pets.pet}</div>
     <div className="card-body">
      <div className="row d-flex justify-content-between align-items-center">
     

      </div>
      </div>
      <div className="card-footer pull-right d-none ">
        <button className="btn btn-success btn-sm" type="button" onClick={() => navigate(`/book-appointment/${pets._id}`)}>View Details</button>
      </div>
    </div> */}
    </>
  );
}

export default PetLists;
