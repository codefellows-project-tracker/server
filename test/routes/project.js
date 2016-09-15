const supertest = require('supertest-as-promised');
const expect = require('chai').expect;

const server = require('../../src/server');
const User = require('../../src/models/user');
const Project = require('../../src/models/project');

describe('/api/project', () => {
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

  describe('GET', () => {
    it('should list projects', () => (
      supertest(server)
        .get('/api/project')
        .expect(200)
        .then((res) => {
          expect(res.body[0].name).to.equal('CPT');
          expect(res.body[0].users[0].password).to.not.exist;
        })
    ));

    it('should get one project', function() {
      return supertest(server)
        .get(`/api/project/${this.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('CPT');
          expect(res.body.users[0].password).to.not.exist;
        });
    });

    it('should 404 on invalid project', () => (
      supertest(server)
        .get('/api/project/57d6e7c2f532ad68ac3d9424')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Project not found');
        })
    ));

    it('should 404 on invalid project id', () => (
      supertest(server)
        .get('/api/project/haha')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.contain('Cast to ObjectId');
        })
    ));
  });

  describe('POST', () => {
    it('should create new project', function() {
      return supertest(server)
        .post('/api/project')
        .send({
          name: 'CPT2',
          hostedUrl: 'https://test2.com',
          githubUrl: 'https://github2.com',
          image: 'https://imgur.com/i/i2.jpg',
          description: 'This is the best2 project EVEAH!',
          classType: 'Javascript 401',
          classNumber: '8',
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).to.exist;
        });
    });

    it('should error on duplicate keys', function() {
      return supertest(server)
        .post('/api/project')
        .send({
          name: 'CPT',
          hostedUrl: 'https://test.com',
          githubUrl: 'https://github.com',
          image: 'https://imgur.com/i/i.jpg',
          description: 'This is the best project EVEAH!',
          classType: 'Javascript 401',
          classNumber: '8',
        })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).to.contain('duplicate key error');
        });
    });
  });

  describe('PUT', () => {
    it('should change project name', function() {
      return supertest(server)
        .put(`/api/project/${this.id}`)
        .send({ name: 'HAHA' })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('HAHA');
          expect(res.body.users[0].password).to.not.exist;
        });
    });

    it('should 404 on invalid project', function() {
      return supertest(server)
        .put('/api/project/57d6e7c2f532ad68ac3d9424')
        .send({ name: 'HAHA' })
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Not Authorization');
        });
    });

    it('should 404 on invalid project id', function() {
      return supertest(server)
        .put('/api/project/haha')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.contain('Not Authorization');
        });
    });
  });

  describe('DELETE', () => {
    it('should delete project', function() {
      return supertest(server)
        .delete(`/api/project/${this.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).to.equal(1);
          expect(res.body.n).to.equal(1);
        });
    });

    it('should 404 on invalid project', function() {
      return supertest(server)
        .delete('/api/project/57d6e7c2f532ad68ac3d9424')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Project not found');
        });
    });

    it('should 404 on invalid project id', function() {
      return supertest(server)
        .delete('/api/project/haha')
        .set('Authorization', `Bearer ${this.token}`)
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal('Not Authorization');
        });
    });
  });
});
