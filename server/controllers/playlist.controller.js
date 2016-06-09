// Given a list of artist names, look up the top songs of the artist and create a new playlist for user
export function generatePlaylist(req, res) {
  // TODO: Implement the logic
  const artists = req.query.artists;
  let playlist = { data: {} };

  if (!artists) {
    return res.json(playlist);
  }

  playlist.data = artists;
  return res.json(playlist);
}
