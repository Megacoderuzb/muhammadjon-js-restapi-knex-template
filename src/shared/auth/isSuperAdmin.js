const express = require("express");
require("dotenv/config");
const jwt = require("jsonwebtoken");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const isSuperAdmin = (req, res, next) => {
  try {
    // const token = req.headers.authorization;
    // const payload = jwt.verify(token, process.env.SECRET_KEY);
    const { role } = req.user;
    
    // console.log(payload);
    if (role != "super_admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error,
    });
  }
};
module.exports = isSuperAdmin;
