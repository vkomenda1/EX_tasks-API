export function authAPI(data) {
  return cy
    .request({
      method: "POST",
      url: "/login",
      body: data,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      console.log(response.body.accessToken);
      return response.body.accessToken;
    });
}
