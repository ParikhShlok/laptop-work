const mongoose = require('mongoose');

// Helper to generate unique IDs for fallback db
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

function createModel(modelName, schemaDefinition) {
  // Compile Mongoose Model
  const MongooseModel = mongoose.model(modelName, new mongoose.Schema(schemaDefinition, { timestamps: true }));

  // Return Unified Interface
  return {
    mongooseModel: MongooseModel,

    find: async (query = {}) => {
      if (global.useMongo) {
        return await MongooseModel.find(query).sort({ createdAt: -1 });
      }
      
      const records = global.localDb.read(modelName);
      // Basic query matching
      return records.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) {
            // Handle simple object ref ID matches or exact matches
            if (typeof query[key] === 'object' && query[key] !== null) {
              // Ignore complex mongoose operators in fallback mode, or do simple checks
              continue;
            }
            if (item[key] != query[key]) return false;
          }
        }
        return true;
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    findOne: async (query = {}) => {
      if (global.useMongo) {
        return await MongooseModel.findOne(query);
      }
      
      const records = global.localDb.read(modelName);
      const match = records.find(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] != query[key]) return false;
        }
        return true;
      });
      return match || null;
    },

    findById: async (id) => {
      if (global.useMongo) {
        return await MongooseModel.findById(id);
      }
      
      const records = global.localDb.read(modelName);
      return records.find(item => item._id === id || item.id === id) || null;
    },

    create: async (data) => {
      if (global.useMongo) {
        return await MongooseModel.create(data);
      }
      
      const records = global.localDb.read(modelName);
      const newRecord = {
        _id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      records.push(newRecord);
      global.localDb.write(modelName, records);
      return newRecord;
    },

    findByIdAndUpdate: async (id, update, options = { new: true }) => {
      if (global.useMongo) {
        return await MongooseModel.findByIdAndUpdate(id, update, options);
      }
      
      const records = global.localDb.read(modelName);
      const index = records.findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;

      // Apply updates (supports flat update objects)
      const current = records[index];
      const updated = {
        ...current,
        ...(update.$set || update),
        updatedAt: new Date().toISOString()
      };
      
      records[index] = updated;
      global.localDb.write(modelName, records);
      return updated;
    },

    findByIdAndDelete: async (id) => {
      if (global.useMongo) {
        return await MongooseModel.findByIdAndDelete(id);
      }
      
      const records = global.localDb.read(modelName);
      const filtered = records.filter(item => item._id !== id && item.id !== id);
      const itemToDelete = records.find(item => item._id === id || item.id === id);
      global.localDb.write(modelName, filtered);
      return itemToDelete || null;
    },

    countDocuments: async (query = {}) => {
      if (global.useMongo) {
        return await MongooseModel.countDocuments(query);
      }
      const records = global.localDb.read(modelName);
      return records.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] != query[key]) return false;
        }
        return true;
      }).length;
    }
  };
}

module.exports = createModel;
