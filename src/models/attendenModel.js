"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const attendenSchema = new mongoose_1.default.Schema({
    classId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Classes',
        required: true,
    },
    attendance: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    attendanceTried: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    timer: {
        type: Number,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    locationRadius: {
        type: Number,
        required: true,
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    isEditable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
attendenSchema.virtual('isEditableUntil').get(function () {
    // Get the date when the document was created
    const createdAt = (0, dayjs_1.default)(this.createdAt);
    // Set the time to 11:59 PM on the same day
    const editableUntil = createdAt.set('hour', 23).set('minute', 59);
    // Return true if the current time is before the editable until time
    return (0, dayjs_1.default)().isBefore(editableUntil);
});
exports.default = mongoose_1.default.model('Attendence', attendenSchema);
