import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Button } from "antd";
import 'bootstrap/dist/css/bootstrap.css';
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import AdminApplyDoctor from "./pages/Admin/ApplyDoctor";
import Notifications from "./pages/Notifications";
import Userslist from "./pages/Admin/Userslist";
import DoctorsList from "./pages/Admin/DoctorsList";
import AppointmentList from "./pages/Admin/AppointmentList";
import Profile from "./pages/Doctor/Profile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import Petlist from "./pages/Admin/PetList";
import AddPet from "./pages/Admin/AddPet";

import Grooming from './pages/Home/Grooming';
import MobileGrooming from "./pages/Home/MobileGrooming";
import Veterinary from "./pages/Home/Veterinary";
import MobileVet from "./pages/Home/MobileVet";
import AddPrescription from "./pages/Doctor/AddPrescription";
import UserHome from './pages/UserHome';
import DoctorHome from './pages/DoctorHome';
import AdminHome from './pages/AdminHome';
import BreakTime from "./pages/Admin/BreakTime";
import ServiceList from "./pages/Admin/ServiceList";
import GroomerAppointments from "./pages/Groomer/GroomerAppointments";
import GroomerHome from "./pages/GroomerHome";
import ReceptionHome from "./pages/ReceptionHome";
import RecProfile from "./pages/Reception/Profile";
import RecPetlist from './pages/Reception/PetList';
import RecServiceList from './pages/Reception/ServiceList';
import RecAddService from './pages/Reception/AddService';
import RecAddPet from './pages/Reception/AddPet';
import RecUserslist from './pages/Reception/Userslist';
import RecDoctorsList from './pages/Reception/DoctorsList';
//import RecGroomersList from './pages/Reception/GroomersList';
import RecAppointmentList from './pages/Reception/AppointmentList';
import RecBreakTime from './pages/Reception/BreakTime';
//import AddService from "./pages/Admin/AddService";
import GroomingList from "./pages/Admin/GroomingList";
import AddPack from "./pages/Admin/AddPack";


function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
   
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
             
          <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          }
          
        />
        {/* <Route
        path='/'
        element={<PublicRoute><Veterinary/></PublicRoute>}
        /> */}
        <Route
        path='/grooming'
        element={<PublicRoute>
          <Grooming/>
          </PublicRoute>}
        />
         <Route
        path='/mobilegrooming'
        element={<PublicRoute>
          <MobileGrooming/>
          </PublicRoute>}
        />
         <Route
        path='/veterinary'
        element={<PublicRoute>
          <Veterinary/>
          </PublicRoute>}
        />
      
           <Route
        path='/mobilevet'
        element={<PublicRoute>
          <MobileVet/>
          </PublicRoute>}
        />
        <Route
        
          path="/apply-doctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/petlist"
          element={
            <ProtectedRoute>
              <Petlist/>
            </ProtectedRoute>
          }
          />
           <Route
          path="/admin/addservices"
          element={
            <ProtectedRoute>
              <AddPack/>
            </ProtectedRoute>
          }
          />
          <Route 
          path="/admin/servicelist"
          element={
            <ProtectedRoute>
              <ServiceList/>
            </ProtectedRoute>
          }
          />
          <Route
          path="/admin/addpet"
          element={
            <ProtectedRoute>
              <AddPet/>
            </ProtectedRoute>
          }
          />
            
        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <Userslist />
            </ProtectedRoute>
          }
        />
        <Route
          
          path="/admin/apply-doctor"
          element={
            <ProtectedRoute>
              <AdminApplyDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctorslist"
          element={
            <ProtectedRoute>
              <DoctorsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointmentlist"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />
           <Route
          path="/admin/groominglist"
          element={
            <ProtectedRoute>
              <GroomingList />
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/breaktime"
          element={
            <ProtectedRoute>
              <BreakTime />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
        path="/reception/profile/:userId"
        element={
          <ProtectedRoute>
            <RecProfile/>
          </ProtectedRoute>
        }
        />
         <Route
          path="/reception"
          element={
            <ProtectedRoute>
                <ReceptionHome/>
            </ProtectedRoute>
          }
        />
      <Route
          path="/reception/petlist"
          element={
            <ProtectedRoute>
              <RecPetlist/>
            </ProtectedRoute>
          }
          />
           <Route
          path="/reception/addservices"
          element={
            <ProtectedRoute>
              <RecAddService/>
            </ProtectedRoute>
          }
          />
          <Route 
          path="/reception/servicelist"
          element={
            <ProtectedRoute>
              <RecServiceList/>
            </ProtectedRoute>
          }
          />
          <Route
          path="/reception/addpet"
          element={
            <ProtectedRoute>
              <RecAddPet/>
            </ProtectedRoute>
          }
          />
            
        <Route
          path="/reception/userslist"
          element={
            <ProtectedRoute>
              <RecUserslist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reception/doctorslist"
          element={
            <ProtectedRoute>
              <RecDoctorsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/appointmentlist"
          element={
            <ProtectedRoute>
              <RecAppointmentList />
            </ProtectedRoute>
          }
        />
         <Route
          path="/reception/breaktime"
          element={
            <ProtectedRoute>
              <RecBreakTime />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groomer"
          element={
            <ProtectedRoute>
              <GroomerHome/>
            </ProtectedRoute>
          
          }
          />
        <Route
          path="/groomer/appointments"
          element={
            <ProtectedRoute>
              <GroomerAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/addprescription"
          element={
            <ProtectedRoute>
              <AddPrescription />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
          
        />
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }
          />
        <Route
          path="/user/addpet"
          element={
            <ProtectedRoute>
              <AddPet/>
            </ProtectedRoute>
          }
          />
           <Route
          path="/user/pets"
          element={
            <ProtectedRoute>
              <Petlist/>
            </ProtectedRoute>
          }
          />
            <Route
          path="/user/appointmentlist"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
