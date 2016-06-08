import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents a music event
const eventSchema = new Schema({
  name: { type: 'String', required: true },
  artists: [{ type: 'String', required: true }],
  dateStart: { type: 'Date', required: true },
  dateEnd: { type: 'Date', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Event', eventSchema);
