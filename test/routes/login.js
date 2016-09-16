const supertest = require('supertest-as-promised');
const expect = require('chai').expect;

const server = require('../../src/server');
const User = require('../../src/models/user');
const Project = require('../../src/models/project');

describe('/api/login', () => {
  beforeEach(function() {
    return new User({
      name: 'Gio d\'Amelio',
      email: 'giodamelio@gmail.com',
      password: 'hunter2',
    }).save()
      .then((user) => {
        this.token = user.getToken();
          // Create a new project with our user included
        return new Project({
          name: 'CPT',
          hostedUrl: 'https://test.com',
          githubUrl: 'https://github.com',
          image: 'https://imgur.com/i/i.jpg',
          description: 'This is the best project EVEAH!',
          classType: 'Javascript 401',
          classNumber: '8',
          users: [user._id],
        }).save()
          .then((project) => {
            this.id = project._id;
          });
      });
  });

  afterEach(() => Promise.all([
    User.remove({}),
    Project.remove({}),
  ]));

  it('should login', () => (
      supertest(server)
        .post('/api/login')
        .send({
          email: 'giodamelio@gmail.com',
          password: 'hunter2',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.token).to.exist;
        })
  ));

  it('should fail on incorrect password', () => (
      supertest(server)
        .post('/api/login')
        .send({
          email: 'giodamelio@gmail.com',
          password: 'hunter3',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).to.equal('Email or password is incorrect');
        })
  ));


  it('should fail on incorrect email', () => (
      supertest(server)
        .post('/api/login')
        .send({
          email: 'giodamelio1@gmail.com',
          password: 'hunter2',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).to.equal('Email or password is incorrect');
        })
  ));
});
