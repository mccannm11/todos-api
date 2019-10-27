const app = require("../app");
const mongoose = require("mongoose");
const fixtures = require("./fixtures");
const User = mongoose.model("User");
let server;

before(done => {
  server = app.listen();
  done();
});

beforeEach(async () => {
  await User.deleteMany({});
  user = new User(fixtures.users[0]);
  user.setPassword(fixtures.users[0].password);
  await user.save();
});

after(done => {
  server.close(done);
  mongoose.connection.close();
});

require("./authTests");
require("./todoTests");
