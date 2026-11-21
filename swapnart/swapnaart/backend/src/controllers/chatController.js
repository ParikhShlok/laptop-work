const Message = require('../models/Message');
const User = require('../models/User');

// Get chat history between a customer and admin
const getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    let otherUserId = req.query.recipientId;

    // If no specific recipient is queried and the sender is a customer, default recipient is the admin
    if (!otherUserId && req.user.role === 'customer') {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        otherUserId = adminUser._id || adminUser.id;
      }
    }

    if (!otherUserId) {
      return res.status(200).json([]); // No other user to load chat with
    }

    // Find messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    });

    // Mark retrieved messages from the other user as read
    const unreadMessages = messages.filter(m => m.recipient === currentUserId && !m.read);
    for (let msg of unreadMessages) {
      await Message.findByIdAndUpdate(msg._id || msg.id, { read: true });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve chat history.', error: error.message });
  }
};

// Get list of active chat contacts for Admin sidebar
const getChatContacts = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'designer') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const admin = await User.findOne({ role: 'admin' });
    const adminId = admin ? (admin._id || admin.id) : req.user.id;

    // Find all unique senders who sent messages to admin, and recipients whom admin messaged
    const allMessages = await Message.find();
    
    const contactIds = new Set();
    allMessages.forEach(msg => {
      if (msg.sender !== adminId) contactIds.add(msg.sender);
      if (msg.recipient !== adminId) contactIds.add(msg.recipient);
    });

    const contacts = [];
    for (let id of contactIds) {
      const user = await User.findById(id);
      if (user) {
        // Fetch last message
        const userMessages = allMessages.filter(m => 
          (m.sender === id && m.recipient === adminId) || 
          (m.sender === adminId && m.recipient === id)
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const lastMessage = userMessages[0] ? userMessages[0].message : '';
        const lastMessageTime = userMessages[0] ? userMessages[0].createdAt : null;
        const unreadCount = userMessages.filter(m => m.sender === id && m.recipient === adminId && !m.read).length;

        contacts.push({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastMessage,
          lastMessageTime,
          unreadCount
        });
      }
    }

    // Sort by last message time
    contacts.sort((a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0));

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load contacts.', error: error.message });
  }
};

module.exports = { getChatHistory, getChatContacts };
