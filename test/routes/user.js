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
        this.id = user._id; // eslint-disable-line no-underscore-dangle
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
        })
    ));

    it('should get one user', function() {
      return supertest(server)
        .get(`/api/user/${this.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('Gio d\'Amelio');
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
});
