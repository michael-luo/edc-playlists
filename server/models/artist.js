import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents an artist
const artistSchema = new Schema({
  id: { type: 'String', required: true },
  name: { type: 'String', required: true },
  genres: [{ type: 'String', required: true }],
  dateAdded: { type: 'Date', default: Date.now, required: true },
  tracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}],
});

export default mongoose.model('Artist', artistSchema);
