import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Passport returns Spotify user profile data in the following example format:
//
// { provider: 'spotify',
//      id: 'SPOTIFY_ID',
//      username: 'SPOTIFY_USERNAME',
//      displayName: 'FIRST_AND_LAST_NAME',
//      profileUrl: 'PROFILE_URL',
//      photos: [ 'IMAGE_URL' ],
//      country: 'US',
//      followers: NUM_FOLLOWERS,
//      product: 'open',
//      _json:
//       { country: 'US',
//         display_name: 'FIRST_AND_LAST_NAME',
//         email: 'EMAIL',
//         external_urls: [Object],
//         followers: [Object],
//         href: 'JSON_USER_INFO_GET_URL',
//         id: 'SPOTIFY_ID',
//         images: [Object],
//         product: 'open',
//         type: 'user',
//         uri: 'spotify:user:SPOTIFY_ID' },
//      emails: [ [Object] ] } }

const userSchema = new Schema({
  accessToken: { type: 'String', required: true },
  refreshToken: { type: 'String', required: true },
  name: { type: 'String', required: true },
  profileUrl: { type: 'String', required: true },
  photos: [{ type: 'String', required: true }],
  email: { type: 'String', required: true },
  country: { type: 'String', required: true },
  spotify: {
    id: { type: 'String', required: true }
  },
  dateAdded: { type: 'Date', default: Date.now, required: true }
});

export default mongoose.model('User', userSchema);
