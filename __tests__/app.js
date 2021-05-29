const { Socket } = require("dgram");
const express = require("express"),
  cors = require("cors"),
  fs = require("fs"),
  net = require("net");

const app = express();

let fetched_data = "";

app.use(cors(), express.json(), express.static("build"));

// read file containing users, and parse it as a json object
const persons = JSON.parse(fs.readFileSync('./users.json'))


// Hosting minindn configuration file

app.get("/file", (req, res) => {
  console.log("Sending file...");

  res.sendFile("topo.conf", { root: __dirname });
});

app.post("/persons", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  const person = persons.filter(
    (p) => p.username === username && p.password === password
  );

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
  let radius = 0.1;
  let angle = 2;

  // nodes section, define all nodes of the network
  textFileContent += "[nodes]\n";

  console.log("All Nodes");
  // adding all nodes from the fetched data 
  fetched_data.nodes.forEach((node) => {
    console.log(node);
    textFileContent += node.id + ": _ " + "radius=" + radius + " angle=" + angle + "\n";
    radius = radius + 0.1;
    angle = angle + 1;
  });

  // switches section, switche(s) for software defined networking (SDN)
  // this switch is going to be connected to the a controller c0
  textFileContent += '[switches]\n';
  textFileContent += 's1: _\n';
  switch1 = 's1';

  // links section, constructing the network
  textFileContent += "[links]\n";
  fetched_data.links.forEach((link) => {
    console.log(link);
    // connecting nodes with each other
    textFileContent += link.source + ":" + link.target + " delay=10ms\n";
  });

  // conecting all switche(s) with all nodes
  fetched_data.nodes.forEach((node) => {
    // temp = switch1 + ":" + node.id;
    // delay is important else the topo file throws an error!!!
    textFileContent += switch1 + ":" + node.id + " delay=10ms\n";
    // console.log(temp);
  });

  // writting the to configuration file
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

module.exports = app;
