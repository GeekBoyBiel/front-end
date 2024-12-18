const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig');
const multer = require('multer');
const axios = require('axios');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
const uploadMultiple = upload.fields([
  { name: 'imagem', maxCount: 1 },
  { name: 'anexo', maxCount: 10 }
]);

router.get('/', (req, res) => {
  res.render('funcionarios');
});

router.get('/dados', (req, res) => {
  const query = `
    SELECT 
      u.Imagem_Url, 
      u.Id_Usuario, 
      c.Id_Matricula, 
      c.Nome, 
      c.Cargo, 
      u.Ativo 
    FROM 
      Usuario u
    INNER JOIN 
      Colaboradores c 
    ON 
      u.Matricula = c.Id_Matricula
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Erro ao obter dados dos funcionários.',
        error: err.message,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Dados dos funcionários obtidos com sucesso.',
      data: results,
    });
  });
});


// Rotas para carregar selects (empresas, regimes, cargos, etc.)
const loadSelects = {
  getEmpresas: `SELECT ne.Id, ne.Razao_Social as text FROM Nossas_Empresas ne WHERE ne.Ativo = -1`,
  getRegimes: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Regime_Empresa'`,
  getCargos: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Cargo_Empresa'`,
  getSetores: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Setor_Empresa'`,
  getFuncoes: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Funcao_Empresa'`,
  getGrauParentesco: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Parentesco_Empresa'`,
  getGeneros: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Genero_Empresa'`,
  getTiposDocumento: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Tipo_Anexo_RH_Empresa'`,
  getEscolaridades: `SELECT d.Id_Descricoes as id, d.Descricao as text FROM Descricao d WHERE d.Categoria = 'Escolaridade_Empresa'`
};

for (const route in loadSelects) {
  router.get(`/${route}`, (req, res) => {
    db.query(loadSelects[route], (err, results) => {
      if (err) {
        console.error(`Erro ao buscar ${route}:`, err);
        return res.status(500).json({
          status: 500,
          success: false,
          message: `Erro ao obter dados para ${route}.`,
          error: err.message
        });
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: `Dados obtidos com sucesso para ${route}.`,
        data: results
      });
    });
  });
}


// Rota: Buscar estados
router.get('/getEstados', async (req, res) => {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const estados = response.data.map(estado => ({ id: estado.id, text: estado.nome }));
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Estados obtidos com sucesso.',
      data: estados
    });
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Erro ao obter estados.',
      error: error.message
    });
  }
});

// Rota: Buscar cidades por estado
router.get('/getCidades/:estadoId', async (req, res) => {
  const { estadoId } = req.params;
  try {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);
    const cidades = response.data.map(cidade => ({ id: cidade.id, text: cidade.nome }));
    res.status(200).json({
      status: 200,
      success: true,
      message: `Cidades do estado ${estadoId} obtidas com sucesso.`,
      data: cidades
    });
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Erro ao obter cidades.',
      error: error.message
    });
  }
});

// Rota: Buscar estado por sigla
router.get('/getEstadoIdBySigla/:sigla', async (req, res) => {
  const { sigla } = req.params;
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const estado = response.data.find(e => e.sigla === sigla.toUpperCase());
    if (estado) {
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Estado encontrado com sucesso.',
        data: { id: estado.id }
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Estado não encontrado.',
      });
    }
  } catch (error) {
    console.error('Erro ao buscar estado:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Erro ao obter estado.',
      error: error.message
    });
  }
});

// Rota: Cadastrar novo colaborador
router.post('/novo-colaborador', uploadMultiple, (req, res) => {
  const {
    nome, data_admissao, cpf, rg, nome_mae, nome_pai, cidade_nascimento, estado_nascimento, escolaridade, genero,
    data_nascimento, regime, telefone, email, empresa, setor, cargo, rua, numero, complemento, bairro, cidade, estado, cep,
    observacoes, cnpj, contatosEmergencia, usuario_precifica, imagem_Url
  } = req.body;

  const query = `
    INSERT INTO Colaboradores (Nome, Data_Admissao, CPF, RG, Nome_Mae, Nome_Pai, Cidade_Nascimento, Estado_Nascimento,
    Escolaridade, Genero, Data_Nascimento, Regime, Telefone, Email, Cargo, Empresa, Setor, Rua, Numero, Complemento, Bairro,
    Cidade, Estado, CEP, Observacoes, Ativo, CNPJ)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    nome, data_admissao, cpf, rg, nome_mae, nome_pai, cidade_nascimento, estado_nascimento,
    escolaridade, genero, data_nascimento, regime, telefone, email, cargo, empresa, setor, rua, numero, complemento, bairro,
    cidade, estado, cep, observacoes, -1, cnpj
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar colaborador:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Erro ao cadastrar colaborador.',
        error: err.message
      });
    }

    const colaboradorId = result.insertId;
    const contatosQuery = `
      INSERT INTO Colaboradores_Contato_Emergencia (Id_Matricula, Nome_Contato_1, Grau_Parentesco_1, Telefone_1,
      Nome_Contato_2, Grau_Parentesco_2, Telefone_2)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const parsedContatosEmergencia = typeof contatosEmergencia === 'string' ? JSON.parse(contatosEmergencia) : contatosEmergencia;

    const contatosValues = [
      colaboradorId,
      parsedContatosEmergencia[0].nome, parsedContatosEmergencia[0].parentesco, parsedContatosEmergencia[0].telefone,
      parsedContatosEmergencia[1] ? parsedContatosEmergencia[1].nome : null,
      parsedContatosEmergencia[1] ? parsedContatosEmergencia[1].parentesco : null,
      parsedContatosEmergencia[1] ? parsedContatosEmergencia[1].telefone : null
    ];

    db.query(contatosQuery, contatosValues, (err) => {
      if (err) {
        console.error('Erro ao cadastrar contatos de emergência:', err);
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Erro ao cadastrar contatos de emergência.',
          error: err.message
        });
      }

      const usuarioQuery = `
        INSERT INTO Usuario (Usuario, Nome_Completo, Nome_Resumido, Nome, Email, Funcao, Id_Cargo, Ativo, Imagem_Url, Senha)
        VALUES (?, ?, ?, ?, ?, ?, 1, -1, ?, ?);
      `;

      const usuarioValues = [usuario_precifica, nome, nome.split(' ')[0], nome, email, colaboradorId, imagem_Url, 'xxxxxxxxxxxxxx'];

      db.query(usuarioQuery, usuarioValues, (err) => {
        if (err) {
          console.error('Erro ao cadastrar usuário:', err);
          return res.status(500).json({
            status: 500,
            success: false,
            message: 'Erro ao cadastrar usuário.',
            error: err.message
          });
        }

        res.status(200).json({
          status: 200,
          success: true,
          message: 'Colaborador cadastrado com sucesso!'
        });
      });
    });
  });
});

module.exports = router;
