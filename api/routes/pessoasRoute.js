const { Router } = require('express');
const PessoaController = require('../controllers/PessoaController');

const router = Router();

router
  .get('/pessoas', PessoaController.getPessoasAtivas)
  .get('/pessoas/todos', PessoaController.getPessoas)
  .get('/pessoas/:id', PessoaController.getPessoaById)
  .post('/pessoas', PessoaController.createPessoa)
  .put('/pessoas/:id', PessoaController.updatePessoa)
  .delete('/pessoas/:id', PessoaController.deletePessoa)
  .post('/pessoas/:id/restaura', PessoaController.restorePessoa)
  .get('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.getMatriculaById)
  .post('/pessoas/:estudanteId/matricula/', PessoaController.createMatricula)
  .put('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.updateMatricula)
  .delete('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.deleteMatricula)
  .post('/pessoas/:estudanteId/matricula/:matriculaId/restaura', PessoaController.restoreMatricula)
  
module.exports = router;