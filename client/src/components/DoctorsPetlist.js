import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const DoctorsPetlist = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
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
        <div><h3>Pets</h3></div>
        <div className="table-responsive-sm">
        <table className="table table-striped">
         <thead>
           <tr>
            
           
             <td>
               Pet
             </td>
             <td>
               Size
             </td>
             <td>Breed</td>
             <td>
               Action
             </td>
           </tr>
         </thead>
         <tbody>
         {pets.map((pet, key) => (
     
             <tr key={pet.key}>
             
             <td>
             {pet.pet}
             </td>
             <td>
               {pet.size}
             </td>
             <td>{pet.breed}</td>
             <td>
             <button className="btn btn-success btn-sm" type="button" onClick={() => navigate(`/book-appointment/${pet._id}`)}><i className="ri-eye-line"></i></button>
             </td>
           </tr>
         ))}
         </tbody>
         </table>
         </div>
       </div>
    )
}

export default DoctorsPetlist;