const supertest = require('supertest-as-promised');
const expect = require('chai').expect;

const server = require('../../src/server');
const User = require('../../src/models/user');

describe('/api/user', () => {
  beforeEach(function() {
    return new User({
      name: 'Gio d\'Amelio',
      email: 'giodamelio@gmail.com',
      password: 'hunter2',
    }).save()
      .then((user) => {
        this.id = user._id;
        this.token = user.getToken();
      });
  });

  afterEach(() => User.remove({}));

  describe('GET', () => {
    it('should list users', () => (
      supertest(server)
        .get('/api/user')
        .expect(200)
        .then((res) => {
          expect(res.body[0].name).to.equal('Gio d\'Amelio');
          expect(res.body[0].password).to.not.exist;
        })
    ));

    it('should get one user', function() {
      return supertest(server)
        .get(`/api/user/${this.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('Gio d\'Amelio');
          expect(res.body.password).to.not.exist;
        });
    });

    it('should 404 on invalid user', () => (
      supertest(server)
        .get('/api/user/57d6e7c2f532ad68ac3d9424')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('User not found');
        })
    ));

    it('should 404 on invalid user id', () => (
      supertest(server)
        .get('/api/user/haha')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.contain('Cast to ObjectId');
        })
    ));
  });

  describe('POST', () => {
    it('should create new user', () => (
      supertest(server)
	.post('/api/user')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: 'hunter2',
        })
	.expect(200)
        .expect((res) => {
          expect(res.body._id).to.exist;
          expect(res.body.password).to.not.exist;
        })
    ));

    it('should error on duplicate keys', () => (
      supertest(server)
        .post('/api/user')
        .send({
          name: 'Gio d\'Amelio',
          email: 'giodamelio@gmail.com',
          password: 'hunter2',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).to.contain('duplicate key error');
        })
    ));
  });

  describe('PUT', () => {
    it('should update user', function() {
      return supertest(server)
        .put(`/api/user/${this.id}`)
        .send({ name: 'HAHA' })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('HAHA');
          expect(res.body.password).to.not.exist;
        });
    });

    it('should 404 on invalid user', function() {
      return supertest(server)
        .put('/api/user/57d6e7c2f532de68ac3d9424')
        .send({ name: 'HAHA' })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Not Authorization');
        });
    });

    it('should 404 on invalid user id', function() {
      return supertest(server)
        .put('/api/user/haha')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Not Authorization');
        });
    });
  });

  describe('DELETE', () => {
    it('should delete user', function() {
      return supertest(server)
        .delete(`/api/user/${this.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).to.equal(1);
          expect(res.body.n).to.equal(1);
        });
    });

    it('should 404 on invalid user', function() {
      return supertest(server)
        .delete('/api/user/57d6e7c2f532ad68ac3d9424')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('User not found');
        });
    });

    it('should 404 on invalid user id', function() {
      return supertest(server)
        .delete('/api/user/haha')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Not Authorization');
        });
    });
  });
});
