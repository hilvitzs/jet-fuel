process.env.NODE_ENV = 'test'

const environment = 'test';
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)
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
   .get('/as;lkfjaslkjfwi')
   .end((err, response) => {
     response.should.have.status(404);
     done();
   });
 });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => {
      database.seed.run()
    })
    .then(() => {
      done()
    })
  })

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done()
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

    it('should return links', (done) => {
      chai.request(server)
      .get('/api/v1/folders/6/links')
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

  describe('POST /api/v1/folders', () => {
    it('should create a new link', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        title: 'something'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(13);
        done();
      })
    })
  })
})
