const { hashSync } = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      // id: 1,
      full_name: "eshmat",
      phone: "+99999999999",
      email: "eshmat@gmail.com",
      password: hashSync("realcoderuz", 10),
      adress: "Sirdaryo",
    },
    {
      // id: 2,
      full_name: "Muhammadjon Abduvahobov",
      phone: "+998916223406",
      email: "muhammadjonabduvahobov7701@gmail.com",
      password: hashSync("megacoderuz", 10),
      adress: "Sirdaryo",
    },
  ]);
};
