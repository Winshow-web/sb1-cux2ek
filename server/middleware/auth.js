import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the "Bearer <token>" format
  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  try {
    // Verify the token
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default verifyToken;