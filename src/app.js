const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid id"})
  }

  return next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if( repoIndex < 0 ){
    return response.status(400).send({error: "Repository not found."});
  }

  repositories[repoIndex] = { ...repositories[repoIndex], title, url, techs}

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if( repoIndex < 0 ){
    return response.status(400).json({error: "Repository not found."});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if( repoIndex < 0 ){
    return response.status(400).send("Repository not found.");
  }

  repositories[repoIndex].likes++;

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
