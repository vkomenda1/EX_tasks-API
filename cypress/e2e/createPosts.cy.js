import { faker } from "@faker-js/faker";
import data from "../fixtures/data.json";
import { authAPI } from "../support/authHelper";
import { registerAPI } from "../support/registerHelper";

describe("Create a post.", () => {
  beforeEach(() => {
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
  });

  const dataPostObject = {
    dataPost: {
      posts: [{ id: 1, title: "json-server", author: "typicode" }],
      comments: [{ id: 1, body: "some comment", postId: 1 }],
      profile: { name: "typicode" },
    },
  };

  it("Create a post.", () => {
    cy.request({
      method: "POST",
      url: "/664/posts",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("Create post with adding access token in header.", () => {
    console.log(data.register);

    registerAPI(data.register);

    authAPI(data.credentials).then((accessToken) => {
      cy.request({
        method: "POST",
        url: "/664/posts",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data.dataPost,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
        console.log(response);
      });
    });
  });

  it("Create post entity and verify that the entity is created.", () => {
    console.log(data.register);

    registerAPI(data.register);

    authAPI(data.credentials).then((accessToken) => {
      cy.request({
        method: "POST",
        url: "/posts",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: dataPostObject,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("id");
      });
    });
  });
});
