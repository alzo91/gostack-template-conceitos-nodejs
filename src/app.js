const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require("uuid");
// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

/* function logMethod(request, response, next) {
  const { method, url } = request;
  console.time(`Starting [${method}] ${url}`);
  next();
  console.timeEnd("Finishing [${method}] ${url}");
} */

// app.use(logMethod);

const repositories = [];

function findingRepositoryIndex(request, response, next) {
  const { id } = request.params;
  const findRepositoryIndex = repositories.findIndex(
    (repo) => String(repo.id) === String(id)
  );

  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: `Project wast't found` });
  }

  request.body.findRepositoryIndex = findRepositoryIndex;

  return next();
}
app.get("/repositories", (request, response) => {
  // TODO
  return response.status(200).json(repositories);
});

app.get("/", (request, response) => {
  return response.status(200).json({ message: "Wellcome to Repositories API" });
});
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const { id } = request.params;
  const findRepositoryIndex = repositories.findIndex(
    (repo) => String(repo.id) === String(id)
  );

  if (findRepositoryIndex < 0) {
    return response.status(400).send(`Project wasn't found!`);
  }

  repositories[findRepositoryIndex] = {
    ...repositories[findRepositoryIndex],
    title,
    url,
    techs,
  };

  return response.status(200).json(repositories[findRepositoryIndex]);
  /**/
});

app.delete("/repositories/:id", findingRepositoryIndex, (request, response) => {
  const { id } = request.params;
  console.log(request.params);
  const { findRepositoryIndex } = request.body;

  console.log(`findRepositoryIndex ${findRepositoryIndex}`, `id ${id}`);

  if (findRepositoryIndex < 0) {
    return response.status(400).send(`Project wasn't found!`);
  } else {
    repositories.splice(findRepositoryIndex, 1);
  }

  return response.status(204).send();
  /** */
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const findRepositoryIndex = repositories.findIndex(
    (repo) => String(repo.id) === String(id)
  );

  if (findRepositoryIndex < 0) {
    return response.status(400).send(`Project wasn't found!`);
  }

  console.log(repositories[findRepositoryIndex]);
  repositories[findRepositoryIndex].likes =
    repositories[findRepositoryIndex].likes + 1;

  return response.status(200).json(repositories[findRepositoryIndex]);
});

module.exports = app;
