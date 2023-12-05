import { faker } from "@faker-js/faker";
import data from "../fixtures/data.json";
import { authAPI } from "../support/authHelper";
import { registerAPI } from "../support/registerHelper";

let email = faker.internet.email();
let password = faker.internet.password({
  length: 20,
  memorable: true,
  pattern: /[A-Z]/,
});

data.credentials.email = email;
data.credentials.password = password;

data.register.email = email;
data.register.password = password;
data.register.firstname = faker.person.firstName();
data.register.lastname = faker.person.lastName();
data.register.age = faker.number.int(1);

data.dataPost.posts[0].id = faker.number.int({ min: 1, max: 10000 });
data.dataPost.posts[0].title = faker.lorem.words(5);
data.dataPost.posts[0].author = faker.person.firstName();

data.dataPost.comments[0].id = faker.number.int({ min: 1, max: 10000 });
data.dataPost.comments[0].body = faker.lorem.words(10);
data.dataPost.comments[0].postId = faker.number.int({ min: 1, max: 10000 });

data.dataPost.profile.name = faker.person.firstName();

const dataPostObject = {
  dataPost: {
    posts: [{ id: 1, title: "json-serveru", author: "typicodeu" }],
    comments: [{ id: 1, body: "some commentu", postId: 1 }],
    profile: { name: "typicodeu" },
  },
};

it("Update non-existing entity", () => {
  registerAPI(data.register);
  authAPI(data.credentials)
  .then((accessToken) => {
    cy.request({
      method: "PUT",
      url: "/posts/1200000",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data.dataPost,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      console.log(response.body);
    });
  });
});
