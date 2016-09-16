const supertest = require('supertest-as-promised');
const expect = require('chai').expect;
const jwt = require('jsonwebtoken');

const server = require('../src/server');
const User = require('../src/models/user');
const Project = require('../src/models/project');
const config = require('../src/config');

describe('Auth', () => {
  beforeEach(function() {
    return new User({
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'hunter17',
      role: 'admin',
    }).save()
      .then((user) => {
        this.adminToken = user.getToken();
        return new User({
          name: 'Gio d\'Amelio',
          email: 'giodamelio@gmail.com',
          password: 'hunter2',
        }).save();
      })
      .then((user) => {
        this.token = user.getToken();
        this.userId = user._id;

        return new User({
          name: 'Second User',
          email: 'second@gmail.com',
          password: 'aaaaaa',
        }).save();
      })
      .then((user) => {
        this.token2 = user.getToken();
        this.userId2 = user._id;

        // Create a new project with our user included
        return new Project({
          name: 'CPT',
          hostedUrl: 'https://test.com',
          githubUrl: 'https://github.com',
          image: 'https://imgur.com/i/i.jpg',
          description: 'This is the best project EVEAH!',
          classType: 'Javascript 401',
          classNumber: '8',
          users: [this.userId],
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

  it('should fail on omitted auth header', () => (
    supertest(server)
      .put('/api/user/aa')
      .send({
        email: 'giodamelio@gmail.com',
        password: 'hunter2',
      })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('Authentication header does not exist');
      })
  ));

  it('should fail on malformed auth header', () => (
    supertest(server)
      .put('/api/user/aa')
      .send({
        email: 'giodamelio@gmail.com',
        password: 'hunter2',
      })
      .set('Authorization', 'aaa')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('Authentication header is malformed');
      })
  ));

  it('should fail on invalid JWT token', () => (
    supertest(server)
      .put('/api/user/aa')
      .send({
        email: 'giodamelio@gmail.com',
        password: 'hunter2',
      })
      .set('Authorization', 'Beader aaa')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('JWT Token invalid');
      })
  ));

  it('should fail on JWT token with invalid _id', () => {
    const token = jwt.sign({ _id: 42 }, config.SECRET);
    return supertest(server)
      .put('/api/user/aa')
      .send({
        email: 'giodamelio@gmail.com',
        password: 'hunter2',
      })
      .set('Authorization', `Beader ${token}`)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('User does not exist');
      });
  });

  it('should fail on JWT token with non existant _id', () => {
    const token = jwt.sign({ _id: '57db42e65458bc63219a0c07' }, config.SECRET);
    return supertest(server)
      .put('/api/user/aa')
      .send({
        email: 'giodamelio@gmail.com',
        password: 'hunter2',
      })
      .set('Authorization', `Beader ${token}`)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('User does not exist');
      });
  });

  it('should delete project with admin role', function() {
    return supertest(server)
      .delete(`/api/project/${this.id}`)
      .set('Authorization', `Bearer ${this.adminToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(1);
        expect(res.body.n).to.equal(1);
      });
  });

  it('should delete user with admin role', function() {
    return supertest(server)
      .delete(`/api/user/${this.userId}`)
      .set('Authorization', `Bearer ${this.adminToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.ok).to.equal(1);
        expect(res.body.n).to.equal(1);
      });
  });

  it('should fail on user without ownership', function() {
    return supertest(server)
      .delete(`/api/project/${this.id}`)
      .set('Authorization', `Bearer ${this.token2}`)
      .expect(401)
      .then((res) => {
        expect(res.body.message).to.equal('Insuffiecnt permission');
      });
  });
});

