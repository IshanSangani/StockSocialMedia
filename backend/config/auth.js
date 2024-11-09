import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: "../config/.env"
});

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Token received:', token ? 'Present' : 'Missing'); // Debug log

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false
            });
        }

        // Synchronous verification
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Token decoded:', decoded); // Debug log

        // Set user object properly
        req.user = {
            _id: decoded.userId
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            message: "Authentication failed. Please login again.",
            success: false
        });
    }
};

export default isAuthenticated;