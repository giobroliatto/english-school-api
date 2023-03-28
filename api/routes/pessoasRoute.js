const { Router } = require('express');
const PessoaController = require('../controllers/PessoaController');

const router = Router();

router
  .get('/pessoas', PessoaController.getPessoasAtivas)
  .get('/pessoas/todos', PessoaController.getPessoas)
  .get('/pessoas/:id', PessoaController.getPessoaById)
  .get('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.getMatriculaById)
  .get('/pessoas/:estudanteId/matricula', PessoaController.getMatriculas)
  .get('/pessoas/matricula/:turmaId/confirmadas', PessoaController.getMatriculasPorTurma)
  .get('/pessoas/matricula/lotada', PessoaController.getTurmasLotadas)
  .post('/pessoas', PessoaController.createPessoa)
  .post('/pessoas/:id/restaura', PessoaController.restorePessoa)
  .post('/pessoas/:estudanteId/matricula/', PessoaController.createMatricula)
  .post('/pessoas/:estudanteId/matricula/:matriculaId/restaura', PessoaController.restoreMatricula)
  .put('/pessoas/:id', PessoaController.updatePessoa)
  .put('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.updateMatricula)
  .delete('/pessoas/:id', PessoaController.deletePessoa)
  .delete('/pessoas/:estudanteId/matricula/:matriculaId', PessoaController.deleteMatricula)
  
module.exports = router;