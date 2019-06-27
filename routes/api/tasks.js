const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Task model
const Task = require("../../models/Task");
// Validation
const validateTaskInput = require("../../validation/task");

// @route   GET api/Tasks
// @desc    Get Tasks
// @access  Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Task.find()
      .sort({ date: -1 })
      .then(Tasks => res.json(Tasks))
      .catch(err => res.status(404).json({ noTasksfound: "No Tasks found" }));
  }
);

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Task.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(task => {
        if (!task) {
          errors = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(task);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/Tasks/:id
// @desc    Get Task by id
// @access  Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Task.findById(req.user.id)
      .then(Task => res.json(Task))
      .catch(err =>
        res.status(404).json({ noTaskfound: "No Task found with that ID" })
      );
  }
);

// @route   Task api/Tasks
// @desc    Create Task
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTaskInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      user: req.user.id
    });

    newTask.save().then(Task => res.json(Task));
  }
);

// @route   DELETE api/Tasks/:id
// @desc    Delete Task
router.delete("/:id", (req, res) => {
  Task.findOne({ user: req.user.id }).then(task => {
    Task.findById(req.params.id)
      .then(Task => {
        // Check for Task owner
        if (Task.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        Task.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ Tasknotfound: "No Task found" }));
  });
});

module.exports = router;
