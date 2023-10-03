const Question = require("../models/Questions");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { text, options } = req.body;
    const question = await Question.create({ text, options });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Could not create question" });
  }
};

// Add options to a question
exports.createOptions = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const newOption = {
      text,
      votes: 0,
      link_to_vote: `/questions/${id}/options/${question.options.length}/add_vote`, // Append link to vote
    };

    question.options.push(newOption);
    await question.save();

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add options" });
  }
};

// Add a vote to an option of a question
exports.addVote = async (req, res) => {
  try {
    const { id, optionId } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const option = question.options.id(optionId);
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    // Increment the votes for the option
    option.votes += 1;

    await question.save();

    res.json({ message: "Vote added successfully", option });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add vote" });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check if the question has votes greater than zero
    const hasVotes = question.options.some((option) => option.votes > 0);
    if (hasVotes) {
      return res
        .status(400)
        .json({ error: "Question cannot be deleted because it has votes" });
    }

    // Delete the question
    await question.remove();

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete question" });
  }
};

// Delete an option
exports.deleteOption = async (req, res) => {
  try {
    const { id, optionId } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Find the index of the option to be deleted
    const optionIndex = question.options.findIndex(
      (option) => option._id == optionId
    );

    if (optionIndex === -1) {
      return res.status(404).json({ error: "Option not found" });
    }

    // Check if the option has votes greater than zero
    if (question.options[optionIndex].votes > 0) {
      return res
        .status(400)
        .json({ error: "Option cannot be deleted because it has votes" });
    }

    // Remove the option from the options array
    question.options.splice(optionIndex, 1);

    await question.save();

    res.json({ message: "Option deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete option" });
  }
};

// View a question with its options and dynamically generate links to vote
exports.viewQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const question = await Question.findById(id);
    console.log(question);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Dynamically generate complete links to vote for each option
    const protocol = req.protocol; // Get the protocol (http or https)
    const host = req.get("host"); // Get the domain and port number from the request headers

    const optionsWithLinks = question.options.map((option) => ({
      _id: option._id,
      text: option.text,
      votes: option.votes,
      link_to_vote: `${protocol}://${host}/questions/${id}/options/${option._id}/add_vote`,
    }));

    res.json({
      _id: question._id,
      text: question.text,
      options: optionsWithLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not view question" });
  }
};
