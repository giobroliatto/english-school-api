const database = require('../models'); // aqui o js já procura por padrão um arquivo chamado "index.js" dentro de models
const Sequelize = require('sequelize');

const { PessoasServices } = require('../services');
const pessoasServices = new PessoasServices();

class PessoaController {

  /* ---------- REGION PESSOA ---------- */
  
  static async getPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await pessoasServices.pegaTodosOsRegistros();
      return res.status(200).json(pessoasAtivas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getPessoas(req, res) {
    try {
      const pessoas = await database.Pessoas.scope('todos').findAll();
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getPessoaById(req, res) {
    const { id } = req.params;

    try {
      const pessoa = await database.Pessoas.findOne(
        { where: {id: Number(id)} }
      );

      return res.status(200).json(pessoa);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createPessoa(req, res) {
    const novaPessoa = req.body;
    
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa);
      return res.status(200).json(novaPessoaCriada);    
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async updatePessoa(req, res) {
    const novasInfos = req.body;
    const { id } = req.params;

    try {
      await database.Pessoas.update(
        novasInfos,
        { where: {id: Number(id)} }
      );

      const pessoaAtualizada = await database.Pessoas.findOne(
        { where: {id: Number(id)} }
      );

      return res.status(200).json(pessoaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deletePessoa(req, res) {
    const { id } = req.params;

    try {
      await database.Pessoas.destroy(
        { where: {id: Number(id)} }
      )

      return res.status(200).json({message: `Id ${id} removido com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async restorePessoa(req, res) {
    const { id } = req.params;
    try {
      await database.Pessoas.restore( {where: { id: Number(id) }} );
      return res.status(200).json( {mensagem: `id ${id} restaurado com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  /* ---------- REGION MATRÍCULA ---------- */

  static async getMatriculaById(req, res) {
    const { estudanteId, matriculaId } = req.params;

    try {
      const matricula = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId), 
          estudante_id: Number(estudanteId)
        } 
      });

      return res.status(200).json(matricula);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async createMatricula(req, res) {
    const { estudanteId } = req.params;
    const novaMatricula = {
      ...req.body, 
      estudante_id: Number(estudanteId)
    };
    
    try {
      const novaMatriculaCriada = await database.Matriculas.create(novaMatricula);
      return res.status(200).json(novaMatriculaCriada);    
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async updateMatricula(req, res) {
    const novasInfos = req.body;
    const { estudanteId, matriculaId } = req.params;

    try {
      await database.Matriculas.update(
        novasInfos,
        { where: {
            id: Number(matriculaId), 
            estudante_id: Number(estudanteId)
          }
        }
      );

      const matriculaAtualizada = await database.Matriculas.findOne(
        { where: {
          id: Number(matriculaId), 
          estudante_id: Number(estudanteId)
        }
      });

      return res.status(200).json(matriculaAtualizada);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deleteMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params;

    try {
      await database.Matriculas.destroy(
        { where: {
          id: Number(matriculaId), 
          estudante_id: Number(estudanteId)
        }
      }
      )

      return res.status(200).json({message: `Id ${matriculaId} removido com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async restoreMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    try {
      await database.Matriculas.restore({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      })
      return res.status(200).json({ mensagem: `id ${id} restaurado`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
 
  static async getMatriculas(req, res) {
    const { estudanteId } = req.params;

    try {
      const pessoa = await database.Pessoas.findOne( { where: { id: Number(estudanteId) } } )
      const matriculas = await pessoa.getAulasMatriculadas()

      return res.status(200).json(matriculas)
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getMatriculasPorTurma(req, res) {
    const { turmaId } = req.params;

    try {
      const todasMatriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: Number(turmaId),
          status: 'confirmado'
        },
        limit: 10, // utilizado pra paginação
        order: [['estudante_id', 'ASC']]
      })

      return res.status(200).json(todasMatriculas);

    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async getTurmasLotadas(req, res) {
    const lotacaoTurma = 2;

    try {
      
      const turmasLotadas = await database.Matriculas.findAndCountAll({
        where: {
          status: 'confirmado',
        },
        attributes: ['turma_id'],
        group: ['turma_id'],
        having: Sequelize.literal(`
          count(turma_id) >= ${lotacaoTurma}
        `)
      })

      return res.status(200).json(turmasLotadas);

    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async cancelPessoa(req, res) {
    const { estudanteId } = req.params;

    try {

      database.sequelize.transaction(async transacao => {
        await database.Pessoas.update(
          { ativo: false },
          { where: { id: Number(estudanteId) } },
          { transaction: transacao }
        )
  
        await database.Matriculas.update(
          { status: 'cancelado' },
          { where: { id: Number(estudanteId) } },
          { where: { estudante_id: Number(estudanteId) } }
        )
  
        return res.status(200).json({ message: `matrículas referente ao estudante ${estudanteId} canceladas.`});
      })

    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = PessoaController;