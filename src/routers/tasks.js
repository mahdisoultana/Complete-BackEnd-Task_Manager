const express = require("express");
///MongoDB Mongoose Modals
const Tasks = require("../models/tasks");
const Auth = require("../middleware/auth");
const router = new express.Router();
//////Create Task Rest API
router.post("/tasks", Auth, async (req, res) => {
  const keysBody = Object.keys(req.body);
  const keyforUpdate = ["completed", "description"];
  const isValidUpdate = keysBody.every(key => {
    return keyforUpdate.includes(key);
  });
  if (!isValidUpdate) {
    return res.status(400).send({ error: "This Key Not Valid" });
  }
  try {
    const Task = new Tasks({ ...req.body, owner: req.user._id });
    const task = await Task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// Get /tasks?sortBy=completed:1
// Get /tasks?sortBy=createdAt:-1 or 1
// Get /tasks?completed=true or false
//////Read Tasks
router.get("/tasks", Auth, async (req, res) => {
  let query = { owner: req.user._id };
  if (req.query.completed) {
    let completed = req.query.completed == "true";
    query = { ...query, completed };
  }
  const sortBy = req.query.sortBy
    ? Object.fromEntries([req.query.sortBy.split(":")])
    : {};

  try {
    const tasks = await Tasks.find(query, null, {
      limit: Number(req.query.limit),
      skip: Number(req.query.skip),
      sort: sortBy
    });
    res.send(tasks);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});
///Read Task By Id

router.get("/task/:id", Auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send(`Task Not Found with This ID ${_id}`);
    }
    res.send(task);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

///Delete Task By Id
router.delete("/task/:id", Auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send(`Task Not Found with This ID ${_id}`);
    }
    res.send("task deleted");
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

///Update Task By ID
router.put("/task/:id", Auth, async (req, res) => {
  const keysBody = Object.keys(req.body);
  const keyforUpdate = ["completed", "description"];
  const isValidUpdate = keysBody.every(key => {
    return keyforUpdate.includes(key);
  });
  if (!isValidUpdate) {
    return res.status(400).send({ error: "This Key Not Valid" });
  }
  try {
    const _id = req.params.id;

    const task = await Tasks.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send(`Task Not Found with This ID ${_id}`);
    }
    for (const key in req.body) {
      task[key] = req.body[key];
    }
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send("Internal Server Error " + e);
  }
});
module.exports = router;

// {
//   "email":"astra@gmail.com",
//  "password":"noxmax12"
// }
