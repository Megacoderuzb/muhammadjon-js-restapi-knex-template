const express = require("express");
require("dotenv/config");
const jwt = require("jsonwebtoken");

/**
 * Used to check if user is authenticated
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const isAdmin = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({
        error: "Ruxsat berilmagan.",
      });
    }
    next();
  } catch (error) {
    // throw new BadRequestErr("Unauthorized! Ruxsat berilmagan!", error);
    next(error);
  }
};
// const isAdmin = (req, res, next) => {
//   try {
//     // const token = req.headers.authorization;
//     // const payload = jwt.verify(token, process.env.SECRET_KEY);
//     const { role } = req.user;
//     // console.log(payload);
//     if (role != "admin") {
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Unauthorized",
//       error,
//     });
//   }
// };
module.exports = isAdmin;
