const chai = require('chai');

const User = require('../src/models/user');
const Project = require('../src/models/project');

const expect = chai.expect;

describe('Test models', () => {
  afterEach(() => Promise.all([
    User.remove({}),
    Project.remove({}),
  ]));

  it('should create user and project', () => {
    const user = new User({
      name: 'Gio',
      email: 'giodamelio@gmail.com',
      password: 'hunter2',
    });

    return user.save()
      .then((newUser) => {
        expect(newUser.id).to.exist;
        expect(newUser.name).to.equal('Gio');

        const project = new Project({
          name: 'Code Fellows Project Tracker',
          users: [newUser.id],
          description: 'The best project EVER!',
          hostedUrl: 'https://giodamelio.com',
          githubUrl: 'https://github.com/codefellows-project-tracker',
          classType: 'Javascript 401',
          classNumber: 'd8',
        });

        return project.save()
          .then(() => Project.find()
            .populate('users')
          )
          .then((projects) => {
            expect(projects[0].users[0].id).to.exist;
            expect(projects[0].users[0].name).to.equal('Gio');
            expect(projects[0].users[0].password).to.not.equal('hunter2');
          });
      });
  });
});
