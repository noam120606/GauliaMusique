module.exports = async (client, app) => {
    app.get("/", function (req, res) {
  		res.send("hi");
	});
}