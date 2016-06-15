/**
 * Simple route middleware to ensure user is authenticated. Use this route middleware on
 * any resource that needs to be protected.  If the request is authenticated (typically
 * via a persistent login session), the request will proceed. Otherwise, the user will be
 * redirected to the login page.
 */
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    const accessToken = req.user.accessToken;
    const refreshToken = req.user.refreshToken;
    return next();
  } else {
    return res.redirect('/');
  }
}
