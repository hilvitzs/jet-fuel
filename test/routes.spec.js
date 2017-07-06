/*jshint expr:true*/

process.env.NODE_ENV = 'test'

const knex = require('../db/knex');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp)

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/sadpanda')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {
  before((done) => {
    knex.migrate.latest()
    .then(() => {
      done();
    });
  });

  beforeEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    })
  })

  describe('POST /api/v1/folders', () => {
    // it('should create a new folder', (done) => {
    //   chai.request(server)
    //   .post('/api/v1/folders')
    //   .send({
    //     title: 'something'
    //   })
    //   .end((err, response) => {
    //     response.should.have.status(201);
    //     response.body.should.be.a('object');
    //     response.body.should.have.property('id');
    //     done();
    //   })
    // })

    it('should not create a folder with a missing title', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        title: ''
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.should.be.a('object');
        response.body.should.have.property('error')
        response.body.error.should.equal('You are missing the title property!');
        done();
      })
    })
  })

  describe('POST /api/v1/links', () => {
    // it('should create a link', (done) => {
    //   chai.request(server)
    //   .post('/api/v1/links')
    //   .send({
    //     long_url: 'www.google.com',
    //     short_url: 'lolol',
    //     folder_id: 1 })
    //   .end((err, response) => {
    //     response.should.have.status(201);
    //     response.body.should.be.a('object');
    //     response.body.should.have.property('id');
    //     done();
    //   })
    // })
  })

  it('should not create a link with a missing property', (done) => {
    chai.request(server)
    .post('/api/v1/links')
    .send({
      long_url: '',
      short_url: 'lolol',
      folder_id: 1
    })
    .end((err, response) => {
      response.should.have.status(422);
      response.body.should.be.a('object');
      response.body.should.have.property('error')
      response.body.error.should.equal('You are missing a property!');
      done();
    })
  })

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('photos');
        done();
      })
    })
  })

describe('GET /api/v1/folders/:id/links', () => {
    it('should return links for a specific folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('long_url');
        response.body[0].long_url.should.equal('http://andrewgarrison.com/wp-content/uploads/2012/10/CodeMonkey-68762_960x3601.jpg');
        response.body[0].should.have.property('short_url');
        response.body[0].short_url.should.equal('j4I90sdknF');
        response.body[0].should.have.property('visits');
        response.body[0].visits.should.equal(0);
        done();
      })
    })
  })

  describe('GET /:short_url', () => {
    // it('should redirect with the correct short url', (done) => {
    //   chai.request(server)
    //   .get('/j4I90sdknF')
    //   .end((err, response) => {
    //     response.should.have.status(301);
    //     done();
    //   })
    // })

    it('should not redirect with incorrect short url', (done) => {
      chai.request(server)
      .get('/jjjjjjjjj')
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal('JUKE! You thought...');
        done();
      })
    })
  })
})
