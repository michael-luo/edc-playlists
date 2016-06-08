import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents a music event
const eventSchema = new Schema({
  name: { type: 'String', required: true },
  year: { type: 'Number', required: true },
  days: { type: 'Number', required: true },
  tag: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  artists: [{ type: 'String', required: true }],
});

export default mongoose.model('Event', eventSchema);
