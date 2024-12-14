/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function (knex) {
  await knex('posts').del();
  await knex('posts').insert([
    { id: 1, user_id: 1, title: 'First Post', content: 'This is the content of the first post.' },
    { id: 2, user_id: 2, title: 'New Post', content: 'This is my first post ever!!' },
    { id: 3, user_id: 2, title: 'Wow', content: 'This is the coolest place I have ever been to.' },
  ]);
};
