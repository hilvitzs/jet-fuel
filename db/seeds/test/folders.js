exports.seed = function(knex, Promise) {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({ id: 1, title: 'photos' }, 'id')
        .then(folder => {
          return knex('links').insert([
            {
              id: 1,
              long_url: 'http://andrewgarrison.com/wp-content/uploads/2012/10/CodeMonkey-68762_960x3601.jpg',
              short_url: 'j4I90sdknF',
              visits: 0,
              folder_id: 1
            }
          ])
        })
      ])
    });
};
