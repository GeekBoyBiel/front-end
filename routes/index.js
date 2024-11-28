const express = require('express');
const router = express.Router();
const db = require('../config/dbConfig1');

// Rota para renderizar 'index.ejs' apenas se o usuário estiver logado
router.get('/',(req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.user ? req.session.user.id : null;

    // Rota para listar notificações não lidas
    db.query('SELECT * FROM Notificacao WHERE Id_User_Destino = ? AND Lido = ? ORDER BY Data_Criacao DESC', [userId, 0], (err, results) => {
      if (err) {
        console.error('Erro ao consultar notificações:', err);
        return res.status(500).json({ message: 'Erro ao listar notificações.' });
      }

      const notifications = results;
      // Renderize 'index.ejs' e passe as notificações para o seu template
      res.render('index', { user: req.session.user, notifications });
    });
  } else {
    res.render('index', { user: req.session.user, notifications: [] }); // Renderiza 'index.ejs' com uma lista vazia de notificações
  }
});

router.get('/metaUsuario', async (req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.user ? req.session.user.id : null;

    try {
      // Sua consulta SQL aqui
      const sql = `
        SELECT 
          DATE_FORMAT(o.Data_Ganho, '%b/%y') AS Periodo_Medicao,
          mc.Meta,
          SUM(o.Valor_Final) AS Total_Orcamentos,
          CASE 
            WHEN SUM(o.Valor_Final) >= mc.Meta THEN 'Meta Atingida'
            ELSE 'Meta não Atingida'
          END AS Meta_Batida
        FROM Orcamento o
        LEFT JOIN Usuario u ON o.Id_Vendedor = u.Id_Usuario 
        LEFT JOIN Meta_Cargo mc ON mc.Id = u.Id_Cargo
        WHERE o.Id_Status = 5
          AND o.Data_Ganho >= DATE_FORMAT(NOW() - INTERVAL 5 MONTH, '%Y-%m-01')
          AND o.Data_Ganho <= NOW()
          AND o.Tipo_Negocio != 'Serviço'
          AND o.Tipo_Negocio != 'POC'
          AND o.Tipo_Negocio != 'Locação'
          AND u.Id_Usuario = ?
        GROUP BY Periodo_Medicao, mc.Meta
        ORDER BY STR_TO_DATE(CONCAT('01-', Periodo_Medicao), '%d-%b/%y');
      `;

      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error('Erro ao consultar meta do usuário:', err);
          // Trate os erros do banco de dados e retorne uma resposta JSON detalhada
          return res.status(500).json({ message: 'Erro ao obter meta do usuário.', error: err.message });
        }

        // Renderize a resposta em JSON (substitua pelo seu método de renderização desejado)
        res.json({ metaUsuario: results });
      });
    } catch (error) {
      console.error('Erro ao consultar meta do usuário:', error);
      res.status(500).json({ message: 'Erro ao obter meta do usuário.', error: error.message });
    }
  } else {
    res.redirect('/login'); // Redireciona para a página de login se o usuário não estiver logado
  }
});

router.get('/ganhosUsuario', async (req, res) => {
  if (req.session.isLoggedIn) {
    const userId = req.session.user ? req.session.user.id : null;

    try {
      // Consulta SQL para obter os ganhos
      const sql = `
        SELECT 
          o.Id_Orc,
          o.Tipo_Negocio,
          IFNULL(o2.Nome_Empresa, p.Nome) AS Cliente,
          CASE WHEN o.Tipo_Negocio = 'POC' THEN 0 ELSE o.Valor_Final End as Valor_Final,
          o.Data_Ganho
        FROM Orcamento o
        LEFT JOIN Organizacao o2 ON o.Id_Organizacao = o2.Id_Organizacao
        LEFT JOIN Pessoa p ON o.Id_Pessoa = p.Id_Pessoa
        WHERE o.Id_Status = 5 
          AND MONTH(o.Data_Ganho) = MONTH(CURDATE()) 
          AND YEAR(o.Data_Ganho) = YEAR(CURDATE()) 
          AND o.Id_Vendedor = ?
        ORDER BY 
          o.Data_Ganho Asc
      `;

      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error('Erro ao consultar ganhos do usuário:', err);
          // Tratamento de erro
          return res.status(500).json({ message: 'Erro ao obter ganhos do usuário.', error: err.message });
        }

        // Retorna os resultados em JSON
        res.json({ ganhosUsuario: results });
      });
    } catch (error) {
      console.error('Erro ao consultar ganhos do usuário:', error);
      res.status(500).json({ message: 'Erro ao obter ganhos do usuário.', error: error.message });
    }
  } else {
    res.redirect('/login'); // Redireciona para a página de login se o usuário não estiver logado
  }
});

module.exports = router;
