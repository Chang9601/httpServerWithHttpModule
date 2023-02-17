const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const getAggregatedData = (users, posts) => {
  const aggregatedData = [];

  posts.forEach((post) => {
    users.forEach((user) => {
      if (post.userId === user.id) {
        aggregatedData.push({
          userID: user.id,
          userName: user.name,
          postingId: post.id,
          postingTitle: post.title,
          postingContent: post.content,
        });
      }
    });
  });

  return aggregatedData;
};

const http = require("http");
const server = http.createServer();

const httpRequestListener = (request, response) => {
  if (request.method === "GET") {
    if (request.url === "/posts") {
      const data = getAggregatedData(users, posts);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ data: data }));
    }
  } else if (request.method === "POST") {
    if (request.url === "/user") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const user = JSON.parse(body);

        users.push({
          id: parseInt(user.id),
          name: user.name,
          email: user.email,
          password: user.password,
        });

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "userCreated" }));
      });
    } else if (request.url == "/post") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: parseInt(post.id),
          title: post.title,
          content: post.content,
          userId: parseInt(post.userId),
        });

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "postCreated" }));
      });
    }
  }
};

server.on("request", httpRequestListener);
server.listen(8000, "127.0.0.1", function () {
  console.log("Listening to requests on port 8000");
});
