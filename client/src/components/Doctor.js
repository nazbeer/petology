import React from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card cursor-pointer mb-4"
      onClick={() => navigate(`/user/booking`)}
    >
      <div className="card-header font-weight-600"> Dr. {doctor.firstName} {doctor.lastName}</div>
     <div className="card-body">
      <div className="row d-flex justify-content-between align-items-center">
      <div className="col-md-6">
        <p className="font-weight-600">Specialization:</p>
        <p className="font-weight-600">Location:</p>
        <p className="font-weight-600">Fees per Visit:</p>
        <p className="font-weight-600">Latest Available Date:</p>
        <p className="font-weight-600">Available Timing:</p>
      </div>
      <div className="col-md-6 ">
        <p className="text-capitalize"> {doctor.specialization}</p>
        <p  className="text-capitalize"> {doctor.address}</p>
        <p className="pricing"> {doctor.feePerCunsultation} AED</p>
        <p >{moment().format('L',doctor.date)}</p>
        <p>{doctor.shift}</p>
      </div>

      </div>
      </div>
      <div className="card-footer pull-right ">
        <button className="btn btn-success btn-sm" type="button" onClick={() => navigate(`/user/booking`)}>Book Now</button>
      </div>
    </div>
  );
}

export default Doctor;
