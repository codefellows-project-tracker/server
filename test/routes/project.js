const supertest = require('supertest-as-promised');
const expect = require('chai').expect;

const server = require('../../src/server');
const Project = require('../../src/models/project');

describe('/api/project', () => {
  beforeEach(function() {
    return new Project({
      name: 'CPT',
      hostedUrl: 'https://test.com',
      githubUrl: 'https://github.com',
      image: 'https://imgur.com/i/i.jpg',
      description: 'This is the best project EVEAH!',
      classType: 'Javascript 401',
      classNumber: '8',
    }).save()
      .then((project) => {
        this.id = project._id;
      });
  });

  afterEach(() => Project.remove({}));

  describe('GET', () => {
    it('should list projects', () => (
      supertest(server)
        .get('/api/project')
        .expect(200)
        .then((res) => {
          expect(res.body[0].name).to.equal('CPT');
        })
    ));

    it('should get one project', function() {
      return supertest(server)
        .get(`/api/project/${this.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('CPT');
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
    it('should create new project', () => (
      supertest(server)
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
	.expect(200)
        .expect((res) => {
          expect(res.body._id).to.exist;
        })
    ));

    it('should error on duplicate keys', () => (
      supertest(server)
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
	.expect(400)
        .expect((res) => {
          expect(res.body.message).to.contain('duplicate key error');
        })
    ));
  });

  describe('PUT', () => {
    it('should change project name', function() {
      return supertest(server)
        .put(`/api/project/${this.id}`)
	.send({ name: 'HAHA' })
        .expect(200)
        .then((res) => {
          expect(res.body.name).to.equal('HAHA');
        });
    });

    it('should 404 on invalid project', () => (
      supertest(server)
        .put('/api/project/57d6e7c2f532ad68ac3d9424')
	.send({ name: 'HAHA' })
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Project not found');
        })
    ));

    it('should 404 on invalid project id', () => (
      supertest(server)
        .put('/api/project/haha')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.contain('Cast to ObjectId');
        })
    ));
  });

  describe('DELETE', () => {
    it('should delete project', function() {
      return supertest(server)
        .delete(`/api/project/${this.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body.ok).to.equal(1);
          expect(res.body.n).to.equal(1);
        });
    });

    it('should 404 on invalid project', () => (
      supertest(server)
        .delete('/api/project/57d6e7c2f532ad68ac3d9424')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal('Project not found');
        })
    ));

    it('should 404 on invalid project id', () => (
      supertest(server)
        .delete('/api/project/haha')
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.contain('Cast to ObjectId');
        })
    ));
  });
});
