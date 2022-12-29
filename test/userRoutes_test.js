const chai = require("chai");
const chaiHttp = require("chai-http");
const Should = chai.should();
const server = require("../app");
require("dotenv").config();


const API = process.env.BASE_URL;
chai.use(chaiHttp);

// describe("/POST testing user signup", () => {
//     it("Create a new user", () => {
//         chai.request(API).post("/api/user/signup").send({
//             name: "nuru",
//             email: "ade@gmail.com",
//             password: "123456789"
//         })
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 res.body.should.be.a("Object");
//                 res.body.should.have.property("message")
//                 res.body.message.should.contain("Welcome ${createUser.name}")
//             })
//     })
// })
describe("/POST testing user signup", () => {
    it("Signout user", () => {
        chai.request(API).get("/api/user/sigout")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("Object");
                res.body.should.have.property("message")
                res.body.message.should.contain("logout user");
                done();
            })
    })
})