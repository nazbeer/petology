import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Button } from "antd";
import "bootstrap/dist/css/bootstrap.css";
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
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import Petlist from "./pages/Admin/PetList";
import AddPet from "./pages/Admin/AddPet";
import AdminProfile from "./pages/Admin/AdminProfile";
import Grooming from "./pages/Home/Grooming";
import MobileGrooming from "./pages/Home/MobileGrooming";
import Veterinary from "./pages/Home/Veterinary";
import MobileVet from "./pages/Home/MobileVet";
import AddPrescription from "./pages/Doctor/AddPrescription";
import UserHome from "./pages/UserHome";
import DoctorHome from "./pages/DoctorHome";
import AdminHome from "./pages/AdminHome";
import BreakTime from "./pages/Admin/BreakTime";
import ServiceList from "./pages/Admin/ServiceList";
import GroomerAppointments from "./pages/Groomer/GroomerAppointments";
import GroomerHome from "./pages/GroomerHome";
import ReceptionHome from "./pages/ReceptionHome";
import RecProfile from "./pages/Reception/Profile";
import RecPetlist from "./pages/Reception/PetList";
import RecServiceList from "./pages/Reception/ServiceList";
import RecAddService from "./pages/Reception/AddService";
import RecAddPet from "./pages/Reception/AddPet";
import RecUserslist from "./pages/Reception/Userslist";
import RecDoctorsList from "./pages/Reception/DoctorsList";
//import RecGroomersList from './pages/Reception/GroomersList';
import RecAppointmentList from "./pages/Reception/AppointmentList";
import RecBreakTime from "./pages/Reception/BreakTime";
//import AddService from "./pages/Admin/AddService";
import GroomingList from "./pages/Admin/GroomingList";
import AddPack from "./pages/Admin/AddPack";
import Prescription from "./pages/Doctor/Prescription";
import MobileGroomingList from "./pages/Admin/MobileGroomingList";
import MobileVetList from "./pages/Admin/MobileVetList";
import UserPetList from "./pages/Pets";
import DoctorList from "./pages/DoctorList";
import BookDoctor from "./pages/BookDoctor";
import UploadHistory from "./pages/Admin/UploadHistory";
import BookingNow from "./pages/BookNow";
//import SignIn from "./pages/SignIn";
import UserAppointments from "./pages/UserAppointments";
import MobLogin from "./pages/MobLogin";
import ActivationPage from "./pages/ActivationPage";
import WalkInBooking from "./pages/Reception/WalkInBooking";
import WalkInBookingAdmin from "./pages/Admin/WalkInBookingAdmin";
import Profile from "./components/Profile";
import PaymentSuccessful from "./components/paymentSuccessful";
import PaymentDecline from "./components/PaymentDecline";
import NotFound from "./components/NotFound";
import Payments from "./components/Payments";
import OfficeTimmings from "./components/OfficeTimmings";

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
          path="/otp-login"
          element={
            <PublicRoute>
              <MobLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/activate/:token"
          element={
            <PublicRoute>
              <ActivationPage />
            </PublicRoute>
          }
        />
        {/* <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        /> */}

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
          path="/grooming"
          element={
            <PublicRoute>
              <Grooming />
            </PublicRoute>
          }
        />
        <Route
          path="/mobilegrooming"
          element={
            <PublicRoute>
              <MobileGrooming />
            </PublicRoute>
          }
        />
        <Route
          path="/veterinary"
          element={
            <PublicRoute>
              <Veterinary />
            </PublicRoute>
          }
        />

        <Route
          path="/mobilevet"
          element={
            <PublicRoute>
              <MobileVet />
            </PublicRoute>
          }
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
              <Petlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/uploadhistory"
          element={
            <ProtectedRoute>
              <UploadHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addservices"
          element={
            <ProtectedRoute>
              <AddPack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/walkin"
          element={
            <ProtectedRoute>
              <WalkInBookingAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/servicelist"
          element={
            <ProtectedRoute>
              <ServiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addpet"
          element={
            <ProtectedRoute>
              <AddPet />
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
          path="/admin/mobilegroominglist"
          element={
            <ProtectedRoute>
              <MobileGroomingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mobilevetlist"
          element={
            <ProtectedRoute>
              <MobileVetList />
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
          path="/admin/profile/:userId"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile/"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/profile/"
          element={
            <ProtectedRoute>
              <RecProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/payment-successful"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/payment-decline"
          element={
            <ProtectedRoute>
              <PaymentDecline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payment-successful"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payment-decline"
          element={
            <ProtectedRoute>
              <PaymentDecline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/payment-successful"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/payment-decline"
          element={
            <ProtectedRoute>
              <PaymentDecline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reception/payment-successful"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reception/payment-decline"
          element={
            <ProtectedRoute>
              <PaymentDecline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groomer/payment-successful"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groomer/payment-decline"
          element={
            <ProtectedRoute>
              <PaymentDecline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception"
          element={
            <ProtectedRoute>
              <ReceptionHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/petlist"
          element={
            <ProtectedRoute>
              <RecPetlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/addservices"
          element={
            <ProtectedRoute>
              <RecAddService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/servicelist"
          element={
            <ProtectedRoute>
              <RecServiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/addpet"
          element={
            <ProtectedRoute>
              <RecAddPet />
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
          path="/reception/walkin"
          element={
            <ProtectedRoute>
              <WalkInBooking />
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
              <Profile />
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
              <GroomerHome />
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
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/booking"
          element={
            <ProtectedRoute>
              <BookingNow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/addpet"
          element={
            <ProtectedRoute>
              <AddPet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/userappointments"
          element={
            <ProtectedRoute>
              <UserAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/doctors"
          element={
            <ProtectedRoute>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/bookdoctor/:doctorId"
          element={
            <ProtectedRoute>
              <BookDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/pets"
          element={
            <ProtectedRoute>
              <UserPetList />
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
        <Route
          path="/user/payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/office-timings"
          element={
            <ProtectedRoute>
              <OfficeTimmings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reception/office-timings"
          element={
            <ProtectedRoute>
              <OfficeTimmings />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
