import moduleName from 'mongoose';
import dayjs from 'dayjs';

const attendenSchema = new moduleName.Schema({
  classId: {
    type: moduleName.Schema.Types.ObjectId,
    ref: 'Classes',
    required: true,
  },
  attendance: [
    {
      type: moduleName.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  attendanceTried: [
    {
      type: moduleName.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  timer: {
    type: Number,
    required: true,
  },
  otp:{
    type: Number,
    required: true,
  },
  locationRadius:{
    type: Number,
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

attendenSchema.virtual('isEditableUntil').get(function() {
  // Get the date when the document was created
  const createdAt = dayjs(this.createdAt);

  // Set the time to 11:59 PM on the same day
  const editableUntil = createdAt.set('hour', 23).set('minute', 59);

  // Return true if the current time is before the editable until time
  return dayjs().isBefore(editableUntil);
});

export default moduleName.model('Attendence', attendenSchema);