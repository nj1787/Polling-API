const express = require("express");
const serverless = require("serverless-http");
const questionController = require("../controllers/question_controller");

const router = express.Router();

const app = express();
app.use(express.json());

// Define your Express.js routes here

router.post("/create", questionController.createQuestion);
router.post("/:id/options/create", questionController.createOptions);
router.post("/:id/options/:optionId/add_vote", questionController.addVote);
router.delete("/:id", questionController.deleteQuestion);
router.delete("/:id/options/:optionId", questionController.deleteOption);
router.get("/:id", questionController.viewQuestion);

module.exports.handler = serverless(app);
