const express = require('express');

const Project = require('../models/project');
const errorHelper = require('../errorHelper');
const isAuthenticated = require('../authMiddleware');

const router = new express.Router();

router.get('/', (req, res) => {
  Project.find({})
    .populate('users', '-password')
    .then((projects) => {
      res.json(projects);
    })
    .catch(errorHelper(res, 500));
});

router.get('/:id', (req, res) => {
  Project.findOne({ _id: req.params.id })
    .populate('users', '-password')
    .then((project) => {
      if (!project) {
        return errorHelper(res, 404)(new Error('Project not found'));
      }
      return res.json(project);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.post('/', isAuthenticated(['user']), (req, res) => {
  const project = new Project(req.body);
  project.save()
    .then((newProject) => {
      res.json(newProject);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return errorHelper(res, 400, 'Duplicate key')(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.put('/:id', isAuthenticated(['user']), (req, res) => {
  Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((updatedProject) => {
      if (!updatedProject) {
        return errorHelper(res, 404)(new Error('Project not found'));
      }
      return res.json(updatedProject);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

router.delete('/:id', isAuthenticated(['user']), (req, res) => {
  Project.remove({ _id: req.params.id })
    .then((deletedProject) => {
      if (deletedProject.result.n === 0) {
        return errorHelper(res, 404)(new Error('Project not found'));
      }
      return res.json(deletedProject);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return errorHelper(res, 404)(err);
      }
      return errorHelper(res, 500)(err);
    });
});

module.exports = router;
