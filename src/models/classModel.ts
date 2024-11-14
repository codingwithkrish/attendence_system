import mongoose, { Document, Schema,PaginateModel  } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

interface IClass extends Document {
    createdBy: mongoose.Types.ObjectId;
    className?: string;
    description?: string;
    imageUrl?: string;
    attendance: mongoose.Types.ObjectId[];
    students: mongoose.Types.ObjectId[];
    classCode: string;
    notices: string[];
}

// Create the schema for the Class model
const classSchema = new mongoose.Schema<IClass>(
  {
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
    attendance: [{
      type: Schema.Types.ObjectId,
      ref: 'Attendence',
      default: [],
    }],
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
    classCode: {
      type: String,
      unique: true,
      required: true,
    },
    notices: [{
      type: String,
      default: [],
    }],
  },
  {
    timestamps: true,
  }
);

// Apply the pagination plugin
classSchema.plugin(mongoosePaginate);
export default mongoose.model<IClass, PaginateModel<IClass>>(
  'Classes',
  classSchema
);
