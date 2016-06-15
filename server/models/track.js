import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents an artist's track
const trackSchema = new Schema({
  id: { type: 'String', required: true },
  name: { type: 'String', required: true },
  genre: { type: 'String', required: false },
  artist: { type: 'String', required: true },
  previewUrl: { type: 'String', required: true },
  uri: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Track', trackSchema);
