const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositoriesArray = [];

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

    repositoriesArray.push(repository);
    
    return response.status(400).json(repository);
    
});

app.get("/repositories", (request, response) => {

  return response.json(repositoriesArray);

});


app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositoriesArray.findIndex(repository => repository.id === id);
    
    if (repositoryIndex === -1){
        return response.status(400).json({error: "Repository not found in the search"});
    }

    const repository = {
        id,
        title,
        url,
        techs,
        likes: repositoriesArray[repositoryIndex].likes,
    };

    repositoriesArray[repositoryIndex] = repository;

    return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositoriesArray.findIndex(repository => 
    repository.id === id
    );

    if (repositoryIndex >= 0){
      repositoriesArray.splice(repositoryIndex, 1);

    } else{
      
      return response.status(400).json({error: "project not found"});
    
    }
    
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params; //grabbing the id from requests

  //checking it exists
  const repositoryIndex = repositoriesArray.findIndex(repository => repository.id === id);

  // checking if ID not found throw an error
  if (repositoryIndex === -1){
    return response.status(400).json({error: "Repository not found"});
    } 

    //update the repository item in context by incrementing the like in object
    repositoriesArray[repositoryIndex].likes ++;

    //returning the response in JSON showing incremented like
    return response.json(repositoriesArray[repositoryIndex]);

});

module.exports = app;
