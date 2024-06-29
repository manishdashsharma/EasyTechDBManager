import {asyncHandler} from '../utils/asyncHandler.js';
import PayloadValidationServices from '../services/validation.services.js'; 
import { databaseSchema, userDataSchema } from '../utils/payloadSchema.js';
import User from '../models/auth.schema.js';

const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const validatePayload = PayloadValidationServices.validateData(userDataSchema, { email });

    if (!validatePayload.isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid payload",
            errors: validatePayload.errors
        });
    }
    
    let existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists with this email",
            response: existingUser
        });
    }

    const user = await User.create({ email });

    if (!user) {
        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
    
    return res.status(200).json({
        success: true,
        message: "User created successfully",
        response: user  
    });
});

export { createUser };
