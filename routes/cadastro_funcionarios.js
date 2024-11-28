const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/dbConfig');
const db2 = require('../config/dbConfig2');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

const storageAnexos = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/anexos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const uploadAnexos = multer({ storage: storageAnexos });

router.post('/novo-colaborador', upload.single('imagem'), (req, res) => {
  const { nome, cargo, estadoCivil, admissao, departamento, regime, empresa, celular, email, cpf, rg, cnpj, aniversario, pai, mae, escolaridade, endereco, contatosEmergencia } = req.body;
  const imagemUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const query = `
    INSERT INTO Colaboradores (Nome, Cargo, Estado_Civil, Data_Admissao, Setor, Regime, Empresa, Telefone, Email, CPF, RG, CNPJ, Data_Nascimento, Nome_Pai, Nome_Mae, Escolaridade, Imagem_Url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [nome, cargo, estadoCivil, admissao, departamento, regime, empresa, celular, email, cpf, rg, cnpj, aniversario, pai, mae, escolaridade, imagemUrl];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar colaborador:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar colaborador.' });
    }

    // Inserir contatos de emergência
    const colaboradorId = result.insertId;
    const contatosQuery = `
      INSERT INTO Colaboradores_Contato_Emergencia (Id_Matricula, Nome_Contato_1, Grau_Parentesco_1, Telefone_1, Nome_Contato_2, Grau_Parentesco_2, Telefone_2)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const contatosValues = [colaboradorId, contatosEmergencia[0].nome, contatosEmergencia[0].parentesco, contatosEmergencia[0].telefone, contatosEmergencia[1].nome, contatosEmergencia[1].parentesco, contatosEmergencia[1].telefone];

    db.query(contatosQuery, contatosValues, (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar contatos de emergência:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar contatos de emergência.' });
      }

      res.json({ success: true, message: 'Colaborador cadastrado com sucesso!' });
    });
  });
});

const fieldToTableColumnMap = {
  Nome: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Nome' },
  Cargo: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Cargo' },
  Estado_Civil: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Estado_Civil' },
  Admissao: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Data_Admissao' },
  Departamento: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Setor' },
  Regime: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Regime' },
  Empresa: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Empresa' },
  Celular: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Telefone' },
  Acesso: { table: 'Usuario', column: 'Funcao' },
  Usuario_Precifica: { table: 'Usuario', column: 'Usuario' },
  Email: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Email' },
  CPF: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'CPF' },
  RG: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'RG' },
  CNPJ: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'CNPJ' },
  Aniversario: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Data_Nascimento' },
  Pai: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Nome_Pai' },
  Mae: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Nome_Mae' },
  Escolaridade: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Escolaridade' },
  Id_Usuario: { table: 'Usuario', column: 'Id_Usuario' },
  Ultimo_Acesso: { table: 'Usuario', column: 'sessionId_Atualizacao' },
  CEP: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'CEP' },
  Rua: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Rua' },
  Numero: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Numero' },
  Complemento: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Complemento' },
  Bairro: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Bairro' },
  Cidade: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Cidade' },
  UF: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Estado' },
  Pessoal_Tel: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Telefone' },
  Pessoal_Celular: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Telefone' },
  Pessoal_Email: { table: 'Colaboradores c JOIN Usuario u ON c.Id_Matricula = u.Matricula', column: 'Email' },
  nome_emergencia1: { table: 'Colaboradores_Contato_Emergencia', column: 'Nome_Contato_1' },
  parentesco_emergencia1: { table: 'Colaboradores_Contato_Emergencia', column: 'Grau_Parentesco_1' },
  tel_emergencia1: { table: 'Colaboradores_Contato_Emergencia', column: 'Telefone_1' },
  celular_emergencia1: { table: 'Colaboradores_Contato_Emergencia', column: 'Telefone_1' },
  nome_emergencia2: { table: 'Colaboradores_Contato_Emergencia', column: 'Nome_Contato_2' },
  parentesco_emergencia2: { table: 'Colaboradores_Contato_Emergencia', column: 'Grau_Parentesco_2' },
  tel_emergencia2: { table: 'Colaboradores_Contato_Emergencia', column: 'Telefone_2' },
  celular_emergencia2: { table: 'Colaboradores_Contato_Emergencia', column: 'Telefone_2' },
};

router.post('/update/', (req, res) => {
  const { field, value } = req.body;
  console.log('Recebido update request:', { field, value });
  const mapping = fieldToTableColumnMap[field];

  if (!mapping) {
    console.log('Campo inválido:', field);
    return res.status(400).json({ success: false, message: 'Campo inválido' });
  }

  const { table, column } = mapping;
  console.log(req);
  console.log('Campo mapeado:', { table, column, userId });

  let finalValue = value;
  console.log('Valor inicial:', finalValue);

  // Verifica se o valor é uma data no formato dd/mm/yyyy e converte para yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const dateParts = value.split('/');
    if (dateParts.length === 3) {
      finalValue = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      console.log('Data convertida para formato SQL:', finalValue);
    }
  }

  const query = `UPDATE ${table} SET ${column} = ? WHERE Id_Usuario = ?`;
  console.log('Query a ser executada:', query);
  console.log('Parâmetros da query:', [finalValue, userId]);

  db.query(query, [finalValue, userId], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar o campo:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar o campo' });
    }
    console.log('Resultado da query:', results);
    console.log('Campo atualizado com sucesso:', { field, finalValue });
    res.json({ success: true });
  });
});

router.get('/get-calendar-data/:id', async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      cpd.data_registro,
      MAX(CASE WHEN rn = 1 THEN cpes.horario END) AS entrada_1,
      MAX(CASE WHEN rn = 2 THEN cpes.horario END) AS saida_1,
      MAX(CASE WHEN rn = 3 THEN cpes.horario END) AS entrada_2,
      MAX(CASE WHEN rn = 4 THEN cpes.horario END) AS saida_2,
      MAX(CASE WHEN rn = 5 THEN cpes.horario END) AS entrada_3,
      MAX(CASE WHEN rn = 6 THEN cpes.horario END) AS saida_3,
      cpa.Detalhes,
      cpa.Tipo_de_Ausencia,
      cpa.aprovacao_data_solicitacao,
      cpa.aprovacao_data_aprovacao,
      cpa.aprovador_nome,
      cal.Descricao_Feriado
    FROM 
      Colaboradores_Ponto_Cadastro cpc
    LEFT JOIN 
      Colaboradores_Ponto_Diario cpd ON cpc.id = cpd.id_funcionario
    LEFT JOIN 
      (
        SELECT 
          cpes.id_registro,
          cpes.horario,
          ROW_NUMBER() OVER (PARTITION BY cpes.id_registro ORDER BY cpes.horario ASC) as rn
        FROM 
          Colaboradores_Ponto_Entradas_Saidas cpes
      ) cpes ON cpes.id_registro = cpd.id_registro
    LEFT JOIN 
      Colaboradores_Ponto_Ausencias cpa ON cpa.Colaborador_Id = cpd.id_funcionario 
      AND cpd.data_registro BETWEEN cpa.data_inicio AND cpa.data_fim
    LEFT JOIN 
      Calendario cal ON cal.Dia = date(cpd.data_registro) AND cal.Feriado_Ativo = -1
    WHERE 
      cpc.id = ?
    GROUP BY 
      cpd.data_registro, 
      cpa.Detalhes, 
      cpa.Tipo_de_Ausencia, 
      cpa.aprovacao_data_solicitacao, 
      cpa.aprovacao_data_aprovacao, 
      cpa.aprovador_nome, 
      cal.Descricao_Feriado
    ORDER BY 
      cpd.data_registro DESC;
  `;

  try {
    const [rows, fields] = await db2.query(query, [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para a página de cadastro_funcionarios
router.get('/', (req, res) => {
  res.render('cadastro_funcionarios', { user: req.session.user });
});

// Rota para obter dados dos produtos com suas imagens
router.get('/dados/:codigo', (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const codigo = req.params.codigo;

  const queryDadosUsuario = `
    SELECT u.Imagem_Url, c.Nome, c.Cargo, u.Id_Usuario, u.sessionId_Atualizacao, c.Data_Admissao as Admissao, 
    c.Regime, u.Funcao as Acesso, c.Telefone, u.Usuario, c.Email, c.*, cce.*, ne.Identificacao, D1.Membros, D1.Setor as Departamento
    FROM Usuario u
    LEFT JOIN Colaboradores c ON u.Matricula = c.Id_Matricula
    LEFT JOIN Colaboradores_Contato_Emergencia cce ON cce.Id_Matricula = c.Id_Matricula
    LEFT JOIN Nossas_Empresas ne ON ne.Id = c.Empresa
    LEFT JOIN (
      SELECT c.setor, COUNT(c.setor) Membros 
      FROM Colaboradores c 
      WHERE Ativo != 0 
      GROUP BY c.setor
    ) as D1 ON D1.setor = c.setor
    WHERE u.Id_Usuario = ?
  `;

  const queryLogsUsuario = `
    SELECT *
    FROM Usuario_Log
    WHERE Id_User = ?
    ORDER BY Data_Atividade DESC
    LIMIT 8;
  `;

  db.query(queryDadosUsuario, [codigo], (err, resultsDadosUsuario) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao obter dados do banco.' });
    }

    db.query(queryLogsUsuario, [codigo], (err, resultsLogsUsuario) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao obter logs do banco.' });
      }

      // Adiciona os logs ao resultado dos dados do usuário
      const resultadoFinal = resultsDadosUsuario.map(usuario => ({
        ...usuario,
        logs: resultsLogsUsuario
      }));

      res.json(resultadoFinal);
    });
  });
});

// Rota para upload de anexos
router.post('/upload-anexos', uploadAnexos.array('arquivos'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo foi enviado.' });
  }

  const arquivos = req.files.map(file => {
    return {
      nome: file.originalname,
      caminho: file.path,
      tipo: req.body.tipoArquivo
    };
  });

  const query = `
    INSERT INTO Anexos (Nome, Caminho, Tipo)
    VALUES (?, ?, ?)
  `;

  arquivos.forEach(arquivo => {
    db.query(query, [arquivo.nome, arquivo.caminho, arquivo.tipo], (err, result) => {
      if (err) {
        console.error('Erro ao salvar anexo no banco de dados:', err);
        return res.status(500).json({ success: false, message: 'Erro ao salvar anexo no banco de dados.' });
      }
    });
  });

  res.json({ success: true, message: 'Arquivos anexados com sucesso!', anexos: arquivos });
});

module.exports = router;
