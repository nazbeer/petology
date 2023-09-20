const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {

    const token = req.headers["authorization"].split(" ")[1];
    // console.log('headers',req.headers["authorization"]);


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log('2', err)
      if (err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.log('1', error)
    return res.status(401).send({
      
      message: "Auth failed",
      success: false,
    });
  }
};

//New Code

// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// // Function to generate a random string
// const generateRandomString = (length) => {
//   return crypto.randomBytes(length).toString("hex");
// };

// // Generate a random JWT secret
// const JWT_SECRET = generateRandomString(32); // You can adjust the length as needed

// module.exports = async (req, res, next) => {
//   try {
//     const token = req.headers["authorization"].split(" ")[1];
//     jwt.verify(token, JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({
//           message: "Auth failed",
//           success: false,
//         });
//       } else {
//         req.body.userId = decoded.id;
//         next();
//       }
//     });
//   } catch (error) {
//     return res.status(401).send({
//       message: "Auth failed",
//       success: false,
//     });
//   }
// };
