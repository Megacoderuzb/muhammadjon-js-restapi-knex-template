const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../db");
const config = require("../../shared/config");

/**
 * Post users
 * @param {express.Request} req
 * @param {express.Response} res
 */
const postUsers = async (req, res) => {
  try {
    const { full_name, phone_number, password, adress } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db("users")
      .insert({
        full_name,
        phone_number,
        adress,
        password: hashedPassword,
      })
      .returning("*");

    res.status(201).json({
      user: result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Get list of users
 * 1. Login qilgan hamma Adminlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getUsers = async (req, res) => {
  try {
    const {
      role,
      q,
      offset = 0,
      limit = 5,
      sort_by = "id",
      sort_order = "desc",
    } = req.query;

    const dbQuery = db("users").select(
      "id",
      "full_name",
      "phone_number",
      "role",
      "email"
    );

    if (role) {
      dbQuery.where({ role });
    }
    if (q) {
      dbQuery
        .where("full_name", "ilike", `%${q}%`)
        .orWhere("phone_number", "ilike", `%${q}%`);
    }

    const total = await dbQuery.clone().count().groupBy("id");

    dbQuery.orderBy(sort_by, sort_order);
    dbQuery.limit(limit).offset(offset);

    const users = await dbQuery;

    res.status(200).json({
      users,
      pageInfo: {
        total: total.length,
        offset,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Get single users
 * 1. Login qilgan hamma Adminlar ko'ra olishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const showUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await db("users")
      .select("id", "full_name", "phone_number", "role", "email")
      .where({ id })
      .first();

    if (!users) {
      return res.status(404).json({
        error: "Admin topilmadi.",
      });
    }

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Login users
 * Admin tizimga kirish uchun login qilishi mumkin
 * @param {express.Request} req
 * @param {express.Response} res
 */
const loginUsers = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    const existing = await db("users")
      .where({ phone_number })
      .select("id", "password", "phone_number")
      .first();

    if (!existing) {
      return res.status(401).json({
        error: "phone_number yoki password xato.",
      });
    }

    const match = await bcrypt.compare(password, existing.password);

    if (!match) {
      return res.status(401).json({
        error: "phone_number yoki password xato.",
      });
    }

    const token = jwt.sign(
      { id: existing.id, role: "user" },
      config.jwt.secret,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,

      users: {
        id: existing.id,
        phone_number: existing.phone_number,
        role: existing.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Update users
 * 1. Faqat super_admin va admin boshqa Adminlarni ma'lumotlarini tahrirlay oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const patchUsers = async (req, res) => {
  try {
    const { ...changes } = req.body;
    const { id } = req.params;

    const existing = await db("users").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli Admin topilmadi.`,
      });
    }

    if (changes.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(changes.password, salt);
      changes.password = hashedPassword;
    }

    const updated = await db("users")
      .where({ id })
      .update({ ...changes })
      .returning(["id", "full_name", "phone_number", "adress", "email"]);

    res.status(200).json({
      updated: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Delete users
 * 1. Faqat super_admin va admin boshqa Adminlarni o'chira oladi
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db("users").where({ id }).first();

    if (!existing) {
      return res.status(404).json({
        error: `${id} idli Admin topilmadi.`,
      });
    }

    const deleted = await db("users")
      .where({ id })
      .delete()
      .returning([
        "id",
        "full_name",
        "phone_number",
        "role",
        "email",
        "password",
        "adress",
      ]);

    res.status(200).json({
      deleted: deleted[0],
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  postUsers,
  getUsers,
  showUsers,
  loginUsers,
  patchUsers,
  deleteUsers,
};
