const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question_controller");

router.post("/create", questionController.createQuestion);
router.post("/:id/options/create", questionController.createOptions);
router.post("/:id/options/:optionId/add_vote", questionController.addVote);
router.delete("/:id", questionController.deleteQuestion);
router.delete("/:id/options/:optionId", questionController.deleteOption);
router.get("/:id", questionController.viewQuestion);

module.exports = router;
