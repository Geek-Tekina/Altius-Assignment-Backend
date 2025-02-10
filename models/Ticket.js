const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  attachment: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed'],
    default: 'Active'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [noteSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ticketSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);