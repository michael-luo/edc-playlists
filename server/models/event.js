import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents a music event
const eventSchema = new Schema({
  name: { type: 'String', required: true },
  year: { type: 'Number', required: true },
  days: { type: 'Number', required: true },
  ref: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  artists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Artist'}],
});

export default mongoose.model('Event', eventSchema);
