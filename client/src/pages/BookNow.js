import React from "react";
import axios from "axios";
import Layout from "../components/Layout";
import petimg from "../images/pet-grooming.png";
import vet from "../images/vet.png";
const BookNow = () => {



return(
    <Layout>
        <div className="d-lg-flex justify-content-center align-items-center gap-2">
            <div className="card">
                <div className="card-body text-center">
                <img src={vet} alt="Grooming Shop" style={{width:'50%'}}/>
                    <h5>Book at Veterinary Clinic</h5>
                </div>
            </div>
            <div className="card">
                <div className="card-body text-center">
                    <img src={petimg} alt="Grooming Shop" style={{width:'50%'}}/>
                    <h5>Book at Grooming Shop</h5>
                </div>
            </div>
        </div>
    </Layout>
);
}
export default BookNow;