const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const Message = require('./models/Message');
const User = require('./models/User');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const designRoutes = require('./routes/designRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
global.io = io; // Make io globally accessible to trigger alerts in other controllers

// Connect to Database
connectDB().then(() => {
  // Database Auto-seeding
  const User = require('./models/User');
  User.countDocuments().then(async count => {
    if (count === 0) {
      console.log('🌱 No users found in database. Seeding default data...');
      try {
        const bcrypt = require('bcryptjs');
        const Service = require('./models/Service');
        const Portfolio = require('./models/Portfolio');
        const Review = require('./models/Review');

        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('AdminPassword123', salt);
        const custPass = await bcrypt.hash('CustomerPassword123', salt);

        // Seeding User
        const admin = await User.create({
          name: 'Swapnaart Admin',
          email: 'admin@swapnaart.com',
          password: adminPass,
          role: 'admin',
          phone: '+91 9999999999'
        });

        const customer = await User.create({
          name: 'John Doe',
          email: 'customer@swapnaart.com',
          password: custPass,
          role: 'customer',
          phone: '+91 8888888888'
        });

        // Seeding Services
        const services = [
          {
            title: 'Visiting Card / Business Card',
            description: 'Premium quality double-sided business cards with standard gloss, matte, or luxury velvet laminations.',
            minPrice: 499,
            maxPrice: 1999,
            deliveryTime: '2 Days',
            category: 'Cards',
            features: ['Double-Sided Design', 'Premium Card Stock', 'Gloss/Matte Lamination', 'Free Direct Shipping'],
            faqs: [
              { q: 'What is the standard card size?', a: 'Standard size is 3.5 inches x 2 inches plus bleed edges.' },
              { q: 'Can I upload my own logo?', a: 'Yes, upload your logo during requirements and we will integrate it.' }
            ]
          },
          {
            title: 'Premium Brand Identity & Logo Design',
            description: 'Complete visual identity package including 3 custom logo concepts, color guides, typography manuals, and stationery design.',
            minPrice: 4999,
            maxPrice: 15000,
            deliveryTime: '5 Days',
            category: 'Branding',
            features: ['3 Premium Logo Concepts', 'Vector Formats (AI, PDF, SVG)', 'Corporate Brand Guidelines', 'Copyright Transfer Certificate'],
            faqs: [
              { q: 'How many revisions do I get?', a: 'We provide unlimited modifications during the design concepts phase.' }
            ]
          },
          {
            title: 'Flex Banner / Outdoor Hoardings',
            description: 'High-definition digital printing for shop banners, outdoor hoardings, and event backgrounds.',
            minPrice: 1500,
            maxPrice: 8500,
            deliveryTime: '3 Days',
            category: 'Banners',
            features: ['All Weather Flex Fabric', 'Rust-Free Eyelets Hooking', 'High Color Depth Saturation', 'Install Support Ready'],
            faqs: [
              { q: 'Do you design and print both?', a: 'Yes, we handle design creation, flex sheet printing, and framing options.' }
            ]
          },
          {
            title: 'Creative Restaurant Menu & Branding',
            description: 'Custom-designed table menus, tri-fold cards, wall mount designs, and digital television layouts.',
            minPrice: 1999,
            maxPrice: 7500,
            deliveryTime: '4 Days',
            category: 'Restaurant',
            features: ['Waterproof Synthetics Sheet', 'High-Res Food Photorealistic Editing', 'Modular Layout Config', 'Digital Menu QR Code Included'],
            faqs: [
              { q: 'Do you take food photos?', a: 'You can provide photos, or we can use high-quality premium stock images.' }
            ]
          }
        ];

        for (let s of services) {
          await Service.create(s);
        }

        // Seeding Portfolio
        const items = [
          {
            title: 'Aura Luxury Spa Branding',
            description: 'Minimalist brand mark, stationery, and packaging identity in champagne gold and rose tones.',
            category: 'branding',
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
            likes: 124
          },
          {
            title: 'Minimalist Studio Visiting Card',
            description: 'Matte black premium card design using textured spot UV finishes.',
            category: 'cards',
            imageUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
            likes: 95
          },
          {
            title: 'Urban Coffee Shop Menu Board',
            description: 'Chalkboard vector layout design showcasing organic brews.',
            category: 'restaurant',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
            likes: 82
          }
        ];
        for (let item of items) {
          await Portfolio.create(item);
        }

        // Seeding Reviews
        const reviews = [
          { customerName: 'Sarah Jenkins', rating: 5, comment: 'SWAPNAART completely revamped our brand logo and labels. Their response time and premium details are outstanding!', featured: true },
          { customerName: 'Rajesh Mehta', rating: 5, comment: 'We ordered 500 business cards and a store flex banner. High-quality print, bright colors, and delivered right to our storefront.', featured: true },
          { customerName: 'Emily Watts', rating: 4, comment: 'The online dashboard made tracking my wedding invites and revisions so easy. Love their graphic style!', featured: true }
        ];
        for (let r of reviews) {
          await Review.create(r);
        }

        console.log('🌱 Database seeded with test accounts, services, portfolios, and testimonials successfully!');
      } catch (err) {
        console.error('❌ Failed to seed database:', err);
      }
    }
  });
});

// Middlewares
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading uploaded images directly on the frontend client
}));
app.use(express.json());

// Serving uploaded static files
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// API Routers
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/chat', chatRoutes);

// Base Check Route
app.get('/', (req, res) => {
  res.json({ message: 'SWAPNAART Agency API Service Running.' });
});

// Socket.IO Communication Logic
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // User joins a room named after their User ID
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`👤 User joined private room: ${userId}`);
  });

  // Client messages
  socket.on('send_message', async (data) => {
    try {
      const { sender, recipient, message, type, attachments, order } = data;

      // Save message to Database
      const newMessage = await Message.create({
        sender,
        recipient,
        message: message || '',
        type: type || 'text',
        attachments: attachments || [],
        order: order || null,
        read: false
      });

      // Send to recipient
      io.to(recipient).emit('receive_message', newMessage);
      // Send receipt back to sender
      io.to(sender).emit('message_sent', newMessage);
    } catch (e) {
      console.error('❌ Failed to process chat message:', e);
    }
  });

  // Typing Indicator
  socket.on('typing', (data) => {
    const { sender, recipient, isTyping } = data;
    io.to(recipient).emit('user_typing', { sender, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
