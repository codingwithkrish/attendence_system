import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Class document
interface IClass extends Document {
    createdBy: mongoose.Types.ObjectId;
    className?: string;
    description?: string;
    imageUrl?: string;
    attendance: string[];
    students: mongoose.Types.ObjectId[];
    classCode: string; // Ensure classCode is always a string
    notices: string[];
}

// Create a schema for the Class model
const classSchema = new mongoose.Schema<IClass>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    className: {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    attendance: [
        {
            type: String,
            default: [],
        }
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    classCode: {
        type: String,
        unique: true,
        required: true,
    },
    notices: [
        {
            type: String,
            default: [],
        }
    ]
}, {
    timestamps: true,
});



// Export the Class model
export default mongoose.model<IClass>('Classes', classSchema);
