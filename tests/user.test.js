const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase, userTwo, userTwoId, taskOne, taskTwo, taskThree} = require('./fixtures/db')


beforeEach(setupDatabase)

test("Should signup a new user", async () =>{
    const response = await request(app).post('/users').send({
        name : "arpit",
        email: "arpitagrawal312@gmail.com",
        password: "Arpit123!"
    }).expect(201)

    const user =  await User.findById(response.body.user._id)
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user : {
            name: "arpit",
            email: "arpitagrawal312@gmail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Arpit123!');
})

test("Should login existing user", async () => {
    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password:  userOne.password
    }).expect(200)
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token); 
})

test("Should not login nonexistent user", async () => {
    await request(app).post('/users/login').send({
        email : '17ucs035@lnmiit.ac.in',
        password:  "Arpit123!"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get profile for unauthenticated user", async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test("Should delete account for user" , async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("Should not delete profile for unauthenticated user", async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload Avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user Fields', async() => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name : 'Vish'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect( user.name).toEqual('Vish');
})

test('Should not update invalid user Fields', async() => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : 'Jaipur'
        })
        .expect(400)
})