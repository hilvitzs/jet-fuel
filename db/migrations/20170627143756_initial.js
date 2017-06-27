exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.timestamps();
    }),

    knex.schema.createTable('links', function(table) {
      table.increments('id').primary();
      table.string('long_url');
      table.string('short_url');
      table.integer('visits');
      table.integer('folder_id').unsigned()
      table.foreign('folder_id')
        .references('folders.id');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('folders'),
    knex.schema.dropTable('links')
  ]);
};
