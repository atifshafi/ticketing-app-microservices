import {app} from '../../app.js'
import request from 'supertest'

it("Expecting 201 from the signup call", async () =>{
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'test_password'
        })
        .expect(201);
});