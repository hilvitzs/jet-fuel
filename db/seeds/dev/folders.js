exports.seed = function(knex, Promise) {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('folders').insert({ title: 'photos' }, 'id')
        .then(folder => {
          return knex('links').insert([
            { long_url: 'http://andrewgarrison.com/wp-content/uploads/2012/10/CodeMonkey-68762_960x3601.jpg',
            short_url: 'http://jet-fuel/salskdfoiq', visits: 0, folder_id: folder[0] }
          ])
        })
      ])
    });
};
