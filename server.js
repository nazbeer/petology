const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require('body-parser');
const dbConfig = require("./config/dbConfig");


app.use(express.json());
const cors = require('cors');
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const petRoute = require("./routes/petRoute");
const serviceRoute = require("./routes/serviceRoute");
const bookingRoute = require("./routes/bookingRoute");
const openRoute = require("./routes/openRoute");
const receptionRoute = require("./routes/receptionRoute");
const groomerRoute = require("./routes/groomerRoute");

//const prescriptionRoute = require("./routes/prescriptionRoute");
app.use(bodyParser.json());
const path = require("path");
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/pet", petRoute);
app.use("/api/service", serviceRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/open", openRoute);
app.use("/api/reception", receptionRoute);
app.use("/api/groomer" , groomerRoute);
//app.use("/api/prescription", prescriptionRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.enable('trust proxy');
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("<div style='text-align:center;margin-top:20px;'><h2>Welcome to Petology</h2></div><div><ul><li><a href='http://localhost:5000/api/users/'>Get Users</a></li><li><a href='http://localhost:5000/api/doctors/'>Get Doctors</a></li><li><a href='http://localhost:5000/api/petlist/'>Get Pet List</a></li><li><a href='http://localhost:5000/api/packages/'>Get Packages</a></li><li><a href='http://localhost:5000/api/appointments/'>Get Appointments</a></li><li><a href='http://localhost:5000/api/services/'>Get Services</a></li></ul>"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
