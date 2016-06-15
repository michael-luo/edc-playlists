import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Represents a playlist created and added to Spotify
const playlistSchema = new Schema({
  id: { type: 'String', required: true },
  ownerId: { type: 'String', required: true },
  name: { type: 'String', required: true },
  href: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}],
});

export default mongoose.model('Playlist', playlistSchema);
