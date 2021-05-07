const supertest = require("supertest"),
app = require("./app"), //reference to app.js file
api = supertest(app);

//Testing connectivity with the frontend
test('Checking connection with Frontend', async () => {
	const response = await api.get("/").expect(200);
})