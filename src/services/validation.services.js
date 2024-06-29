import { z } from "zod";

class PayloadValidationServices {
    static validateData(schema, data) {
        const validationResult = schema.safeParse(data);
        if (validationResult.success) {
            return { isValid: true, validatedData: validationResult.data };
        } else {
            return { isValid: false, errors: validationResult.error.errors };
        }
    }
}

export default PayloadValidationServices;