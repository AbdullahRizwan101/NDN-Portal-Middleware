const express = require("express"),
  cors = require("cors"),
  fs = require("fs");

const app = express();
const port = 3001;
let fetched_data = "";

app.use(cors(), express.json(), express.static("build"));

const persons = [{ username: "yumna", password: "123" }];

// Hosting minindn configuration file
app.get("/file", (req, res) => {
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
  fetched_data = JSON.stringify(req.body);

  console.log(`Fetched Data is :${fetched_data}`);

  // Writing the fetched data from frontend to a file
  fs.writeFile("fetched_data.txt", fetched_data, function (err) {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Reading the fetched data file

const data = JSON.parse(fs.readFileSync("fetched_data.txt", "utf-8"));

// Converting the JSON format to minindn topology configuration file
let textFileContent = "";

textFileContent += "[nodes]\n";
data.nodes.forEach((node) => {
  textFileContent += `${node.id}: _ radius=0.5 angle=2.6415\n`;
});

textFileContent += "[links]\n";
data.links.forEach((link) => {
  textFileContent += `${link.source}:${link.target} delay=10ms\n`;
});

fs.writeFile("topo.conf", textFileContent, function (err) {
  if (err) {
    return console.log(err);
  }
});
