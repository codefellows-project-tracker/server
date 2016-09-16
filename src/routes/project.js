const express = require('express');
const mustbe = require('mustbe').routeHelpers();

const Project = require('../models/project');
const errorHelper = require('../errorHelper');

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

router.post('/', mustbe.authorized('any-user'), (req, res) => {
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

router.put('/:id', mustbe.authorized('project'), (req, res) => {
  Project.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch(errorHelper(res, 500));
});

router.delete('/:id', mustbe.authorized('project'), (req, res) => {
  Project.remove({ _id: req.params.id })
    .then((deletedProject) => res.json(deletedProject))
    .catch(errorHelper(res, 500));
});

module.exports = router;
