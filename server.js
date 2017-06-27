const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const port = (process.env.PORT || 3000);
const express = require('express');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app'));
app.get('/', (request, response) => response.sendFile(path.join(__dirname, './app/index.html')));

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then(folders => {
      response.status(200).json(folders);
    })
    .catch(error => {
      console.error('error: ', error)
    });
});

app.post('/api/v1/folders', (request, response) => {
  const folder = request.body;

  database('folders').insert(folder, 'id')
    .then(folder => {
      response.status(201).json({ id: folder[0] })
    })
    .catch(error => {
      console.error('error: ', error);
    });
});

app.get('/folders/:id/links', (request, response) => {
  const { id } = request.params;

  database('links').where('folder_id', id).select()
  .then(links => {
    response.status(200).json(links)
  })
  .catch(error => {
    console.log('error: ', error)
  });
});

app.post('/api/v1/links', (request, response) => {
  const link = request.body;

  database('links').insert(link, 'id')
  .then(link => {
    response.status(201).json({ id: link[0] })
  })
  .catch(error => {
    console.log('error: ', error)
  });
});

app.get('*', (request, response) => response.sendFile(path.join(__dirname, './app/index.html')));

app.listen(port);

console.log(`Listening at http://localhost${port}`);

module.exports = app;
