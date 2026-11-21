const createModel = require('./modelHelper');

const DesignSchema = {
  owner: { type: String, required: true }, // User ID (admin or designer)
  title: { type: String, required: true },
  canvasData: { type: String, required: true }, // Serialized JSON string of canvas layers
  previewUrl: { type: String, default: '' } // Base64 or image link preview
};

module.exports = createModel('Design', DesignSchema);
