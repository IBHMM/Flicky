export const verifyAdmin = async (req, res, next) => {
    try {
      const user = req.user;
  
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  