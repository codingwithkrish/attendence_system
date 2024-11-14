"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const locationSchema = new mongoose_1.default.Schema({
    coordinates: {
        type: {
            type: String,
            enum: ['Point'], // We specify 'Point' for GeoJSON point
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Should be an array of numbers [longitude, latitude]
            required: true
        }
    },
    address: {
        type: String,
        required: [true, "Event Venue is required"]
    }
}, { timestamps: true });
locationSchema.index({ coordinates: '2dsphere' });
const Location = mongoose_1.default.model("Location", locationSchema);
exports.default = Location;
