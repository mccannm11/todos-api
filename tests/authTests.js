const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const fixtures = require("./fixtures");
const User = mongoose.model("User");

describe("POST /api/auth/register", () => {
  let data = {
    name: "Mike McCann",
    email: "fake@fake.com",
    password: "password"
  };
  it("respond with 201 created", done => {
    request(app)
      .post("/api/auth/register")
      .send(data)
      .set("Accept", "application/json")
      .expect(201)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
  it("respond with error on duplicate", done => {
    data.email = "tim@huggins.com";
    request(app)
      .post("/api/auth/register")
      .send(data)
      .set("Accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
  it("respond with 422 when password is blank", done => {
    data.email = "tim@huggins.com";
    request(app)
      .post("/api/auth/register")
      .send({ ...data, password: "" })
      .set("Accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
  it("respond with 422 when email is blank", done => {
    data.email = "tim@huggins.com";
    request(app)
      .post("/api/auth/register")
      .send({ ...data, email: "" })
      .set("Accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /api/auth/login", () => {
  it("responds with 200", done => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "tim@huggins.com", password: "password" })
      .set("accept", "application/json")
      .expect(200)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });

  it("responds with 401", done => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "tim@huggins.com", password: "wrong_pass" })
      .set("accept", "application/json")
      .expect(401)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
  it("responds with 422 with no email", done => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "", password: "password" })
      .set("accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
  it("responds with 422 with no password", done => {
    request(app)
      .post("/api/auth/login")
      .send({ email: "tim@huggins", password: "" })
      .set("accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
});

describe("GET /api/auth/me", () => {
  it("responds with 422 with no token", done => {
    request(app)
      .get("/api/auth/me")
      .set("accept", "application/json")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
  it("responds with 422 with blank token", done => {
    request(app)
      .get("/api/auth/me")
      .set("accept", "application/json")
      .set("x-access-token", "")
      .expect(422)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
  it("responds with 401 with no invalid token", done => {
    request(app)
      .get("/api/auth/me")
      .set("accept", "application/json")
      .set("x-access-token", "this_is_not_correct")
      .expect(401)
      .end(err => {
        if (err) return done(err);
        return done();
      });
  });
  it("responds with 200 with correct token", done => {
    User.findOne({ email: "tim@huggins.com" }).exec((err, user) => {
      const token = user.generateJWT(user._id);
      request(app)
        .get("/api/auth/me")
        .set("accept", "application/json")
        .set("x-access-token", token)
        .expect(200)
        .end(err => {
          if (err) return done(err);
          return done();
        });
    });
  });
});
