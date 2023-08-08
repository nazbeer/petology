import React from 'react';
import Layout from "../../components/Layout";
import ScheduleForm from '../../components/ScheduleForm';

const AddSchedule = () =>{
    return(
        <Layout>
        <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Add Schedule</h5>
        
  
        </div>
        <hr />
        <ScheduleForm />
      </Layout>
    )
}

export default AddSchedule;