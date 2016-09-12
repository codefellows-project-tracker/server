const supertest = require('supertest-as-promised');

const server = require('../../src/server');

describe('/api/user', () => {
  it('should list users', () => (
    supertest(server)
      .get('/api/user')
      .expect(200)
      .expect([])
  ));
});
