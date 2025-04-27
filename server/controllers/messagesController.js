const messageModel = require("../model/messageModel");


module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    let fileData = null;

    if (req.file) {
      fileData = {
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
      };
    }

    const newMessage = {
      users: [from, to],
      sender: from,
    };

    if (message) {
      newMessage.message = { text: message };
    }

    if (fileData) {
      newMessage.file = fileData;
    }

    const data = await messageModel.create(newMessage);

    if (data) return res.json({ msg: "Message added successfully." });
    return res.json({ msg: "Failed to add message to DB" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({ users: { $all: [from, to] } })
      .sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from.toString(),
      message: msg.message?.text || "",
      file: msg.file ? {
        url: msg.file.url,
        type: msg.file.type,
      } : null,
      createdAt: msg.createdAt,
      messageId: msg._id,
    }));

    res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const deletedMessages = await messageModel.deleteMany({
      users: { $all: [from, to] },
    });
    if (deletedMessages.deletedCount === 0) {
      return res.status(404).json({ msg: "No messages found" });
    }
    res.json({ msg: "All messages deleted successfully" });
  } catch (ex) {
    next(ex);
  }
};
module.exports.deleteMessageById = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await messageModel.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ msg: "Message not found" });
    }
    res.json({ msg: "Message deleted successfully" });
  } catch (ex) {
    next(ex);
  }
}
