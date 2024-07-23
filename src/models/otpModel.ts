import { create } from "domain";
import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    }
})
export default mongoose.model('Otp', otpSchema)