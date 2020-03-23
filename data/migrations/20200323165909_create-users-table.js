exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments();

    table.string("username", 64).notNullable();

    table.string("password", 64).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
