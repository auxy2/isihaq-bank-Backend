import mongoose  from "mongoose";


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        trim: true
    },
    password: {
        type: String,
        trim: true
    }, 
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required'],
        trim: true
    } ,
    walletBalance: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("User", UserSchema);