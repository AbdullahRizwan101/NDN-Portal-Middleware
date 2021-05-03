const { Socket } = require("dgram");

const express = require("express"),
  cors = require("cors"),
  fs = require("fs"),
  net = require("net");

const app = express();

const port = 3001;

let fetched_data = "";

app.use(cors(), express.json(), express.static("build"));

const persons = [{ username: "yumna", password: "123" }];

// Hosting minindn configuration file

app.get("/file", (req, res) => {
  console.log("Sending file...");

  res.sendFile("topo.conf", { root: __dirname });
});

app.post("/persons", (request, response) => {
  const username = request.body.username;

  const password = request.body.password;

  console.log(username, password);

  const person = persons.filter(
    (p) => p.username === username && p.password === password
  );

  console.log(person);

  if (person.length > 0) {
    response.status(200).json({
      success: true,
    });
  } else {
    response.status(204).json({
      success: false,
    });
  }
});

// Getting information of nodes from frontend

app.post("/topology", (req, res) => {
  console.log(req.body);

  fetched_data = req.body;

  console.log(`Fetched Data is :${fetched_data}`);

  let textFileContent = "";

  textFileContent += "[nodes]\n";

  let radius = 0.1;

  let angle = 2;

  fetched_data.nodes.forEach((node) => {
    console.log(node);

    textFileContent +=
      node.id + ": _ " + "radius=" + radius + " angle=" + angle + "\n";

    radius = radius + 0.1;

    angle = angle + 1;
  });

  // adding switches for software defined networking (SDN)
  // this switch is going to be connected to the a controller c0
  textFileContent += '[switches]\n';
  textFileContent += 's1: _\n';
  switch1 = 's1';

  // adding links/nodes
  textFileContent += "[links]\n";

  fetched_data.links.forEach((link) => {
    console.log(link);
    // connecting nodes with each other
    textFileContent += link.source + ":" + link.target + " delay=10ms\n";
  });

  // conecting all switches with links/nodes
  fetched_data.links.forEach((link) => {
    textFileContent += switch1 + ":" + link.
  });

  fs.writeFile(
    "topo.conf",

    textFileContent,

    { encoding: "ascii" },

    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  res.sendStatus(200);
});

app.post("/output", (req, res) => {
  console.log(req.body);

  res.send("Received!");
});

app.post("/command", (req, res) => {
  const command = req.body.command;

  console.log(`Command: ${command}`);

  const client = new net.Socket();

  client.connect(6500, "127.0.0.1", () => {
    console.log("Connected");

    client.write(command);
  });

  client.on("data", (data) => {
    console.log(`Received: ${data}`);

    client.end();

    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// // Reading the fetched data file

// const data = JSON.parse(fs.readFileSync("fetched_data.txt", "utf-8"));

// // Converting the JSON format to minindn topology configuration file

// let textFileContent = "";

// textFileContent += "[nodes]\n";

// let radius = 0.1;

// let angle = 2;

// data.nodes.forEach((node) => {

//   textFileContent +=

//     node.id + ": _ " + "radius=" + radius + " angle=" + angle + "\n";

//   radius = radius + 0.1;

//   angle = angle + 1;

// });

// textFileContent += "[links]\n";

// data.links.forEach((link) => {

//   textFileContent += link.source + ":" + link.target + " delay=10ms\n";

// });

// fs.writeFile(

//   "topo.conf",

//   textFileContent,

//   { encoding: "ascii" },

//   function (err) {

//     if (err) {

//       return console.log(err);

//     }

//   }

// );
