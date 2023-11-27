export function registerAPI(data) {
  return cy
    .request({
      method: "POST",
      url: "/register",
      body: data,
    })
    .then((response) => {
      console.log("registerAPI:");
      expect(response.status).to.eq(201);
    });
}
