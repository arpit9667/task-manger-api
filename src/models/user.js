const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require("../models/task")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email :{
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Email is invalid!!')
        
        },
        trim: true,
        lowercase : true
    }, 
    age: {
        type: Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive');
            }   
        }
    },
    password :{
        type : String,
        required: true,
        minlength: 7, 
        validate(value){
            if(value.toLowerCase().includes("password"))
                throw new Error(" Password contain 'password'!!");
        },
        trim: true
    },
    tokens : [{
        token:{
            type :String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: "Task",
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject

}

userSchema.methods.getAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "hello!!");
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user)
        throw new Error('Unable to Login!!!')
    
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)
        throw new Error("Unable to Login!!!");
    return user;
} 

userSchema.pre('save' , async function(next){
    const user = this;
    // console.log('Saving...')
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema )

module.exports = User