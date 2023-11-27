import { faker } from "@faker-js/faker";
import data from "../fixtures/data.json";
import { authAPI } from "..//support/authHelper";
import { registerAPI } from "..//support/registerHelper";

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
    posts: [{ id: 1, title: "json-server", author: "typicode" }],
    comments: [{ id: 1, body: "some comment", postId: 1 }],
    profile: { name: "typicode" },
  },
};

it("Delete non-existing post entity.", () => {
  cy.request({
    method: "DELETE",
    url: "/posts/4000000",
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(404);
  });
});

it("Create post entity, update the created entity, and delete the entity", () => {
  let responseId;
  let responseIdUpdate;

  registerAPI(data.register);
  authAPI(data.credentials).then((accessToken) => {
    cy.request({
      method: "POST",
      url: "/posts",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data.dataPost,
    })
      .then((response) => {
        expect(response.status).to.eq(201);
        responseId = response.body.id; // Зберігаємо response.body.id у змінну
        console.log("responseId:", responseId);
      })
      .then(() => {
        cy.request({
          method: "PUT",
          url: "/posts/" + responseId,
          body: dataPostObject,
        })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(responseId);
            responseIdUpdate = response.body.id; // Зберігаємо response.body.id у змінну
            console.log("responseIdUpdate:", responseIdUpdate);
          })
          .then(() => {
            cy.request({
              method: "DELETE",
              url: "/posts/" + responseIdUpdate,
            }).then((response) => {
              expect(response.status).to.eq(200);
              console.log("DELETE", responseIdUpdate);
            });
          });
      });
  });
});
