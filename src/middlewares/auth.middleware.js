import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/auth.schema.js';

export const validateApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.header("Authorization")?.replace("Bearer ", "");

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "Please provide an API key"
        });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid API key"
        });
    }

    if (!user.is_active) {
        return res.status(403).json({
            success: false,
            message: "Your API key is deactivated"
        });
    }

    req.user = user;
    next();
});
