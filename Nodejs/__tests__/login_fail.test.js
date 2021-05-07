const supertest = require("supertest"),
app = require("./app"), //reference to app.js file
api = supertest(app);

//Testing either username or password is incorrect
test('Username and password does not exists', async () => {
	await api.post("/persons").send({username: "notauser", password: "123"}).expect(204);
})