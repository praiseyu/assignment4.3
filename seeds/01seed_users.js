/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require("bcryptjs");
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  const hashedPassword = await bcrypt.hash('123', 10);
  await knex('users').insert([
    { id: 1, name: 'John Smith', email: 'johnsmith@example.com', password: hashedPassword },
    { id: 2, name: 'Mike Wazowski', email: 'mikewazowski@example.com', password: hashedPassword }
  ]);
};
