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


//add new folder
app.post('/api/v1/folders', (request, response) => {
  const folder = request.body;

  for (let requiredParameter of ['title']) {
    if (!folder[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: { title: <String> }.
        You are missing a ${requiredParameter} property.`
      });
    }
  }

  database('folders').insert(folder, 'id')
    .then(folder => {
      response.status(201).json({ id: folder[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//get all folders
app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
  .then(folders => {
    if (folders) {
      response.status(200).json(folders);
    }
    response.status(404).json({
      error: 'No Folders Found'
    });
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

//add new link
app.post('/api/v1/links', (request, response) => {
  const link = request.body;

  database('links').insert(link, 'id')
  .then(link => {
    response.status(201).json({ id: link[0] });
    console.log(link[0]);
  })
  .catch(error => {
    console.log('error: ', error);
  });
});

//get links for specific folder
app.get('/api/v1/folders/:id/links', (request, response) => {
  const { id } = request.params;

  database('links').where('folder_id', id).select()
  .then(links => {
    if (links) {
      response.status(200).json(links);
    }
    response.status(404).json({
      error: 'No Links Found'
    });
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

//redirect to url in search bar
app.get('/api/:short_url', (request, response) => {
  const { short_url } = request.params;
  console.log(request.params, 'these are the params');

  database('links').where('short_url', short_url).increment('visits', 1)
  .then(() => database('links').where('short_url', short_url).select())
  .then(column => {
    console.log(column);
    return response.redirect(301, `${column[0].long_url}`)
  });
});


app.get('*', (request, response) => response.sendFile(path.join(__dirname, './app/index.html')));

app.listen(port);

console.log(`Listening at http://localhost${port}`);

module.exports = app;
