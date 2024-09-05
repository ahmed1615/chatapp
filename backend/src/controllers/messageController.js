const Message = require('../models/Message');
exports.sendMessage = async (req, res) => {
  const { sender, text } = req.body;

  try {
    const newMessage = new Message({ sender, text });
    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
