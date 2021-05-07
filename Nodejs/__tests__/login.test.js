const supertest = require("supertest"),
app = require("./app"), //reference to app.js file
api = supertest(app);


//Testing username and password are both correct
test('Username and password exists', async () => {
	await api.post("/persons").send({username: "tameem", password: "123"}).expect(200);
})
