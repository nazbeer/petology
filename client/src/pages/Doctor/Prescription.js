import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
const Prescription = () => {
    const [prescriptions , setPrescriptions]  =useState([])
    useEffect(()=>{
        getPrescriptions();
        },[]);
        async function getPrescriptions(){
            try{
                let response=await axios.get('/api/prescription/get-prescriptions', {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                console.log(response);
                if (response){
                    setPrescriptions([...prescriptions,...response]);
                    return prescriptions;
                    }else throw new Error("Error while fetching data");
                    }catch(error) {console.log(`Error ${error}`);};
                    };
                    return (
                        <Layout>
                    <div>
                        <h3 className="text-center">All Prescriptions</h3><br/>
                        <div className='card'>
                            <div className='card-body'>
                            <div className='table-responsive-sm'>
                        <table className="table table-striped " >

                            <thead>
                                <th>
                                    Appointment Id
                                </th>
                                <th>
                                    Prescription
                                </th>
                                <th>
                                    Description
                                </th>
                                <th>
                                    Next Appointment
                                </th>
                                <th>
                                    Actions
                                </th>
                            </thead>
                            <tbody>
                                {prescriptions && prescriptions?.map((presc)=>{
                                    return(
                                    <tr key={presc._id}><td colspan="5">adfasdf{presc._id}</td></tr>
                                    )
                                })
                            }
                     
                            </tbody>
                        </table>
                        
                        </div>
                            </div>
                        </div>
                       
                    </div>
                    </Layout>
                    );
}
export default Prescription;