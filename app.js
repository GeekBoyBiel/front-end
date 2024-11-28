const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const sharedSession = require('socket.io-express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');
const path = require('path');
const cron = require('cron').CronJob;
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const device = require('express-device');
const db = require('./config/dbConfig');
// Importa a função de agendamento de alarmes
const promClient = require('prom-client'); // Adicionando prom-client
const app = express();
const PORT = process.env.PORT || 4000;


// Configurando prom-client para coletar métricas padrão
promClient.collectDefaultMetrics();

// Rota para acesso seguro aos arquivos de uploads

// Configuração de middleware
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(cookieParser());
app.use(device.capture());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets'))); // Serve a pasta assets sem prefixo
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const routes = [

  // Opções não presentes no menu
  { path: '/', router: require('./routes/funcionarios') },

  // R.H.
  { path: '/funcionarios', router: require('./routes/funcionarios') },
  { path: '/cadastro_funcionarios', router: require('./routes/cadastro_funcionarios') },
  
];
routes.forEach(route => app.use(route.path, route.router));
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



