const express = require("express");
const cors = require("cors");

require("./Config/Config"); //config file

const User = require("./Schema/User"); //user schema
const Task = require("./Schema/Task"); //task schema
const Jwt = require("jsonwebtoken");
const jwtKey = "task-manager";
const app = express();
app.use(express.json());
app.use(cors());
const port = 3500;

//Sign Up API
app.post("/signup", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send("Something went wrong");
    }
    resp.send({ result, auth: token });
  });
});

//Log In API

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send("Something went wrong");
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "No User found" });
    }
  } else {
    resp.send({ result: "No User found" });
  }
});

//Add task API

app.post("/add-task", async (req, resp) => {
  let task = new Task(req.body);
  let result = await task.save();
  resp.send(result);
});

app.get("/task", async (req, resp) => {
  const task = await Task.find();
  if (task.length > 0) {
    resp.send(task);
  } else {
    resp.send({ result: "No Product found" });
  }
});

// Delete task API
app.delete("/task/:id", async (req, resp) => {
  let result = await Task.deleteOne({ _id: req.params.id });
  resp.send(result);
});

//search API

app.get("/task/:id", async (req, resp) => {
  let result = await Task.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No Record Found." });
  }
});

//Update API

app.put("/update-task/:id", async (req, resp) => {
  let result = await Task.updateOne({ _id: req.params.id }, { $set: req.body });
  console.log(result);
  resp.send(result);
});

app.get("/search/:key", async (req, resp) => {
  let result = await Task.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
      {
        company: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
    ],
  });
  resp.send(result);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
