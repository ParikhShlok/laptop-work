const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Review = require('../models/Review');

const JWT_SECRET = process.env.JWT_SECRET || 'swapnaart_super_secret_jwt_key_9988';

const register = async (req, res) => {
  try {
    const { name, email, password, phone, username, address, city, pinCode, state, taxNumber, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      username: username || '',
      address: address || '',
      city: city || '',
      pinCode: pinCode || '',
      state: state || '',
      taxNumber: taxNumber || '',
      role: role || 'customer'
    });

    // Create token
    const token = jwt.sign({ id: newUser._id || newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        username: newUser.username,
        walletBalance: newUser.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id || user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        username: user.username,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      language: user.language,
      username: user.username,
      address: user.address,
      city: user.city,
      pinCode: user.pinCode,
      state: user.state,
      taxNumber: user.taxNumber,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile.', error: error.message });
  }
};

// Seed utility to create default database rows if empty
const seedDatabase = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    let seededData = {};

    // 1. Seed Users (Admin & Customer)
    if (usersCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPass = await bcrypt.hash('AdminPassword123', salt);
      const custPass = await bcrypt.hash('CustomerPassword123', salt);

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

      seededData.users = { admin: admin.email, customer: customer.email };
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
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
      seededData.servicesCount = services.length;
    }

    // 3. Seed Portfolio
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
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
      seededData.portfolioCount = items.length;
    }

    // 4. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const reviews = [
        { customerName: 'Sarah Jenkins', rating: 5, comment: 'SWAPNAART completely revamped our brand logo and labels. Their response time and premium details are outstanding!', featured: true },
        { customerName: 'Rajesh Mehta', rating: 5, comment: 'We ordered 500 business cards and a store flex banner. High-quality print, bright colors, and delivered right to our storefront.', featured: true },
        { customerName: 'Emily Watts', rating: 4, comment: 'The online dashboard made tracking my wedding invites and revisions so easy. Love their graphic style!', featured: true }
      ];
      for (let r of reviews) {
        await Review.create(r);
      }
      seededData.reviewsCount = reviews.length;
    }

    res.status(200).json({ message: 'Database Seeded successfully!', data: seededData });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed.', error: error.message });
  }
};

module.exports = { register, login, getProfile, seedDatabase };
