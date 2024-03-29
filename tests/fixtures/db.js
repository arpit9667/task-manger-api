const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId,
    name : "vishal",
    email: "17ucc068@lnmiit.ac.in",
    password: "Vishal123!",
    tokens: [{
            token : jwt.sign({ _id : userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId,
    name : "abhijeet",
    email: "17ucc004@lnmiit.ac.in",
    password: "Abhi123!",
    tokens: [{
            token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description : "First Task",
    isCompleted: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description : "Second Task",
    isCompleted: true,
    owner: userOneId
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description : "Third Task",
    isCompleted: true,
    owner: userTwoId
}

const setupDatabase = async() =>  {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save() 
    await new User(userTwo).save()
    await new Task(taskOne).save() 
    await new Task(taskTwo).save() 
    await new Task(taskThree).save() 

}

module.exports = {
    userOneId,
    userOne,
    setupDatabase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
}