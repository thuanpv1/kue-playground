const axios = require("axios");

const kue = require("kue");
const express = require("express");
const app = express();
const port = 3000;
const queue = kue.createQueue();

app.get("/", (req, res) => {
  for (let i = 1; i <= 20; i++) {
    queue
      .create("queue example", {
        title: "This testing request",
        data: i
      })
      .priority("high")
      .attempts(5)
      .save();
  }
  res.send("Hello World!");
});
queue.process("queue example", (job, done) => {
  axios
    .get("https://jsonplaceholder.typicode.com/todos/" + job.data.data)
    .then(result => {
      console.log('result.data====', result.data);
      done();
      return result.data;
    })
    .catch(error => {
      console.log('error===', error)
      
      done(error)
      });
});

app.use("/kue-api/", kue.app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
