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

/* 깊은 복사 */
const cloneObject = (obj) => {
  let clone = {};
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] != null) {
      clone[key] = cloneObject(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }

  return clone;
};

/* -1인 경우 예외 처리 필요 */
const getIndex = (id, data) => {
  const idx = data.findIndex((datum) => {
    return datum.id === id;
  });

  return idx;
};

/* 사용자의 모든 게시물 */
const getUserPosts = (idx, posts) => {
  const user = cloneObject(users[idx]);

  user.postings = [];

  user.userID = user.id;
  user.userName = user.name;

  posts.forEach((post) => {
    if (user.id === post.userId) {
      user.postings.push({
        postingId: post.id,
        postingName: post.title,
        postingContent: post.content,
      });
    }
  });

  delete user.email;
  delete user.password;
  delete user.id;
  delete user.name;

  return user;
};

/* 모든 게시물 */
const getPosts = (users, posts) => {
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
      const data = getPosts(users, posts);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ data: data }));
    } else if (request.url === "/users") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        let id = JSON.parse(body);
        id = parseInt(id.id);
        const idx = getIndex(id, users);
        const data = getUserPosts(idx, posts);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ data: data }));
      });
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
    } else if (request.url === "/post") {
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
  } else if (request.method === "PATCH") {
    if (request.url === "/post") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        const update = JSON.parse(body);
        const id = parseInt(update.id);
        const idx = getIndex(id, posts);

        const post = posts[idx];
        post.title = update.title;
        post.content = update.content;

        const data = getPosts(users, posts);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ data: data[idx] })); // posts 배열과 같은 순서
      });
    }
  } else if (request.method === "DELETE") {
    if (request.url === "/post") {
      let body = "";

      request.on("data", (data) => {
        body += data;
      });

      request.on("end", () => {
        let id = JSON.parse(body);
        id = parseInt(id.id);
        const idx = getIndex(id, posts);

        posts.splice(idx, 1);

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "postingDeleted" }));
      });
    }
  }
};

server.on("request", httpRequestListener);
server.listen(8000, "127.0.0.1", function () {
  console.log("Listening to requests on port 8000");
});
