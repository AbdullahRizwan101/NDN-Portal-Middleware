const supertest = require("supertest"),
app = require("./app"), //reference to app.js file
api = supertest(app);

//Testing for request to /topology as POST
test('Submitting data as a POST request to /toplogy', async () => {
	await api.post("/topology").send({"nodes":[{"id":"node0"},{"id":"node1"}],"links":[{"source":"node0","target":"node1"}]}).expect(200);
})