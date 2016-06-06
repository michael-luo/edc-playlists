export function self(req, res) {
  let data = {};

  if (req.isAuthenticated() && req.user) {
    data = req.user;
  }

  res.json({ data: data });
}
