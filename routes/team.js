const express = require("express");
const router = express.Router();
const teamModel = require("./../models/Team.js");
const fileUploader = require("./../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");

//  --------------------------------------
// ROUTES PREFIX IS    /api/team
//  --------------------------------------

router.get("/", function (req, res, next) {
	teamModel
		.find()
		.populate("sport club registeredPlayers")
		.then((dbResTeam) => {
			res.status(200).json(dbResTeam);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// router.get("/:query", function (req, res, next) {
// 	const query = req.params.query;
// 	teamModel
// 	  .find(query)
// 	  .then((dbResTeam) => {
// 		res.status(200).json(dbResTeam);
// 	  })
// 	  .catch((err) => {
// 		res.status(500).json(err);
// 	  });
//   });

router.get("/:id", (req, res) => {
	teamModel
		.findById(req.params.id)
		.populate("sport club registeredPlayers")
		.then((team) => {
			res.status(200).json(team);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.post(
	"/",
	protectPrivateRoute,
	fileUploader.single("image"),
	(req, res) => {
		const newTeam = { ...req.body, club: req.session.currentUser._id };

		if (req.file) {
			console.log(req.file);
			newTeam.image = req.file.path;
		}
		teamModel
			.create(newTeam)
			.then((team) => {
				res.status(201).json(team);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	}
);

router.patch(
	"/:id",
	protectPrivateRoute,
	fileUploader.single("image"),
	(req, res) => {
		const updatedTeam = { ...req.body };
		if (req.file) {
			console.log(req.file);
			updatedTeam.image = req.file.path;
		}
		teamModel
			.findByIdAndUpdate(req.params.id, updatedTeam, { new: true })
			.then((updatedTeam) => {
				res.status(200).json(updatedTeam);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
);

router.delete("/:id", protectPrivateRoute, (req, res) => {
	teamModel
		.findByIdAndRemove(req.params.id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;
