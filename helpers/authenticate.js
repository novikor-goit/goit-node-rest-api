import passport from "passport";
import HttpError from "./HttpError.js";

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authenticate;
