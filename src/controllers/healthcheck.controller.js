import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheckService = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json({ 
        success: true,
        message: "API services are running fine" 
    });

});

const authHealthCheckServices = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json({ 
        success: true,
        message: "Auth services are running fine" 
    });
});

const paymentHealthCheckServices = asyncHandler(async (req,res) => {
    return res
   .status(200)
   .json({ 
        success: true,
        message: "Payment services are running fine" 
    });
});

const notificationHealthCheckServices = asyncHandler(async (req,res) =>{
    return res
   .status(200)
   .json({ 
        success: false,
        message: "Notification services are not yet ready" 
    });
});

export { 
    healthCheckService,
    authHealthCheckServices,
    paymentHealthCheckServices,
    notificationHealthCheckServices
}