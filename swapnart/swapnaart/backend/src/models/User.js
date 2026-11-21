const createModel = require('./modelHelper');

const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'designer', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  username: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  state: { type: String, default: '' },
  taxNumber: { type: String, default: '' },
  walletBalance: { type: Number, default: 0 },
  language: { type: String, enum: ['en', 'hi', 'gu'], default: 'en' }
};

module.exports = createModel('User', UserSchema);
