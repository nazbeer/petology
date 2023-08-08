import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { Link } from 'react-router';
import moment from "moment";
import PetForm from "../../components/PetForm";
function AddPet() {
 

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center">
      <h3 className="">Add New Pet</h3>
      

      </div>
      <hr />
      <PetForm />
    </Layout>
  );
}

export default AddPet;
