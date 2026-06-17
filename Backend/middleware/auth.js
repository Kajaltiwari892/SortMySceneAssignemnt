// Simple auth middleware - in production, use JWT
export const authenticate = (req, res, next) => {
  try {
    // For now, we'll extract userId from header
    // In production, this would validate JWT tokens
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user ID",
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const optionalAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (userId) {
    req.userId = userId;
  }
  next();
};
