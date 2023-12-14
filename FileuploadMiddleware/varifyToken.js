const varifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ Error: "You are not authenticated" });
    } else {
      jwt.verify(token, "JSONWEBTOKEN", (err, decoded) => {
        if (err) return res.status(401).json({ Error: "Token is invalid" });
        req.role = decoded.role;
        req.id = decoded.id;
        next();
      });
    }
  };

  module.export = varifyToken;