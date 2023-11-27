it("Get all posts", () => {
  cy.request({
    method: "GET",
    url: "/posts",
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.headers["content-type"]).to.eq(
      "application/json; charset=utf-8"
    );
  });
});

it("Get only first 10 posts.", () => {
  cy.request({
    method: "GET",
    url: "/posts",
  }).then((response) => {
    expect(response.status).to.eq(200);

    const firstTenPosts = response.body.slice(0, 10);
    expect(firstTenPosts).to.have.length(10);
  });
});

it("Get posts with id = 55 and id = 60", () => {
  cy.request({
    method: "GET",
    url: "/posts",
  }).then((response) => {
    expect(response.status).to.eq(200);

    const postsWithIDs = response.body.filter(
      (post) => post.id === 55 || post.id === 60
    );

    expect(postsWithIDs).to.have.length(2);

    postsWithIDs.forEach((post) => {
      expect(post.id).to.be.oneOf([55, 60]);
    });
  });
});
