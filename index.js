const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Middleware que checa se o projeto existe

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

//Middleware que dá log no número de requisições

function logRequests(req, res, next) {
  console.count('Número de requisições');

  return next();
}

server.use(logRequests);

// GET retornar todos projetos

server.get('/projects', (req, res) => {
  return res.json(projects);
});

/** POST
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  res.json(projects);
});

/** PUT
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((proj) => proj.id == id);

  project.title = title;

  return res.json(project);
});

/** DELETE
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  //pega o index
  const projectIndex = projects.findIndex((p) => p.id == id);

  //deleta o projeto correspondente ao index
  projects.splice(projectIndex, 1);

  return res.json({ message: 'Projeto deletado coom Sucesso' });
});

/** POST
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id;
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((p) => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3001);
