import React from 'react';
import PrescriptionForm from '../../components/PrescriptionForm';
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Link } from 'react-router';
import moment from "moment";
const AddPrescription = () =>{
    return(
        <Layout>
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Add Prescription</h5>
        
  
        </div>
        <hr />
        <PrescriptionForm />
      </Layout>
    )
}

export default AddPrescription;