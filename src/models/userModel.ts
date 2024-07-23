import moduleName from 'mongoose'
const userSchema = new moduleName.Schema({
    userType:{
        type:String,
        required: true,
        enum: ['teacher', 'student','admin'],

    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
     gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female", "other"]
    },
    phone:{
        type: String,
        required: false,
    },
    uniqueRollId:{
type: String,
required: true,
    
    },
    notificationToken:{
        type: String,
        required: false,
    },
    images:[
    {
        type:String,
        default: []
    }
    ]
},{
    timestamps: true
})
export default moduleName.model('User', userSchema)