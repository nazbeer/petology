import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";

import moment from "moment";
import ServiceForm from "../../components/ServiceForm";
//import FormService from "../../components/FormService";

function AddService() {
 

  return (
    <Layout>
      <h1 className="page-header">Add New Service</h1>
      <hr />
 <ServiceForm/>
    </Layout>
  );
}

export default AddService;
