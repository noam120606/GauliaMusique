module.exports = async (client, app) => {
    app.get("/", function (req, res) {
  		res.send("hi");
	});

    console.log('[WebServer] module UptimeRobot chargé')
}