let hoje = new Date();
export let dataFormatada = hoje.getFullYear() + '/' + String(hoje.getMonth() + 1).padStart(2, '0') + '/' + String(hoje.getDate()).padStart(2, '0');


function funcaoConfirmacao(confirmado) {
  if (confirmado) {
    enviarLogParaServidor('Ação confirmada!');
      // Adicione aqui o código para a ação confirmada
  } else {
    enviarLogParaServidor('Ação cancelada.');
      // Adicione aqui o código para a ação cancelada
  }
}


function bigNumber(casasDecimais, valor) {
  if (valor >= 1000000) {
      return (valor / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + 'M'; // Divide por 1 milhão e adicione 'M'
  } else if (valor >= 1000 && valor < 1000000) {
      return (valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: casasDecimais }) + 'k'; // Divide por 1 mil e adicione 'k'
  } else {
      return valor.toLocaleString('pt-BR', { maximumFractionDigits: casasDecimais }); // Caso contrário, apenas formate o número normalmente
  }
}
function bigNumberMoeda(casasDecimais, valor) {
  // Verifica se o valor é um número e não é nulo
  if (valor !== null && !isNaN(valor)) {
      // Verifica se o valor é negativo
      const sinal = valor < 0 ? '-' : '';
      valor = Math.abs(valor);

      // Formata o valor conforme necessário
      if (valor >= 1000) {
          return  sinal + bigNumber(casasDecimais, valor); // Adiciona o símbolo do Real (R$) após o valor formatado
      } else {
          return sinal + valor.toLocaleString('pt-BR', { maximumFractionDigits: casasDecimais }); // Formata o valor como moeda brasileira
      }
  } else {
      // Retorna um valor padrão ou uma string indicativa para valores nulos ou inválidos
      return '0,00'; // ou outra string que você preferir
  }
}
//FORMATAÇÃO DE COISAS
function moeda(valor) {
    // Verifica se o valor é um número e não é nulo
    if (valor !== null && !isNaN(valor)) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    } else {
        // Retorna um valor padrão ou uma string indicativa para valores nulos ou inválidos
        return 'R$ 0,00'; // ou outra string que você preferir
    }
}
function moeda_2(valor) {
  // Verifica se o valor é um número e não é nulo
  if (valor !== null && !isNaN(valor)) {
      return valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 3, // Garante que o número tenha sempre três casas decimais
          maximumFractionDigits: 3
      });
  } else {
      // Retorna um valor padrão ou uma string indicativa para valores nulos ou inválidos
      return 'R$ 0,000'; // Valor padrão com três casas decimais
  }
}

function formatarComoMoeda(valor) {
  if (typeof valor === 'number') {
      valor = valor.toFixed(2).toString();
  }

  // Verifica se o valor é negativo
  let isNegative = false;
  if (valor.startsWith('-')) {
      isNegative = true;
      valor = valor.substring(1); // Remove o sinal de negativo temporariamente
  }

  // Remove tudo que não é dígito
  valor = valor.replace(/\D/g, '');

  // Converte para decimal
  valor = (parseFloat(valor) / 100).toFixed(2);

  // Formata como moeda
  valor = valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Adiciona o sinal de menos de volta se o valor for negativo
  if (isNegative) {
      valor = '-' + valor;
  }

  return 'R$ ' + valor;
}


function tempoRealMoeda(seletorCSS) {
    var elementos = document.querySelectorAll(seletorCSS);
    if (elementos.length) {
        elementos.forEach(function(campo) {
            campo.addEventListener('input', function () {
                this.value = formatarComoMoeda(this.value);
            });
        });
    } else {
        console.error('Elemento(s) não encontrado(s) para o seletor:', seletorCSS);
    }
}
function parseFloatMoeda(valor, valorPadrao = 0.00) {
  if (typeof valor !== 'string') {
      // Se o valor não é uma string, retorna o valor padrão desejado
      return valorPadrao;
  }

  // Verifica se o ponto está presente no final do valor
  if (/\.\d{2}$/.test(valor)) {
      return parseFloat(valor) || valorPadrao; // Mantém o ponto decimal se for do formato "xxxxxx.xx"
  }

  // Remove qualquer símbolo de moeda e espaços extras
  valor = valor.replace(/[^\d,.-]/g, '').trim();

  // Remove pontos usados como separadores de milhar
  valor = valor.replace(/\./g, '');

  // Substitui a vírgula por ponto para fazer o parse correto em float
  valor = valor.replace(',', '.');

  // Converte para float, ou retorna o valor padrão se a conversão falhar
  return parseFloat(valor) || valorPadrao;
}
function validaNaN(value) {
    if (isNaN(value)) {
    return '-';
    } else {
    return value;
    }
}
function removerFormatacaoMaskMoney(valorFormatado) {
    // Substitui ',' por '.' e remove outros caracteres não numéricos
    let valorNumerico = parseFloat(valorFormatado.replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
    return valorNumerico;
}
function formatarData(dataISO) {
  if (!dataISO || dataISO === '0000-00-00') {
      return ''; // Retorna uma string vazia se a data for nula, indefinida ou '0000-00-00'
  }

  // Verifica se a data é válida
  const data = new Date(dataISO);
  if (isNaN(data.getTime())) {
      return ''; // Retorna uma string vazia se a data for inválida
  }

  // Extrai o dia, mês e ano
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // O mês é base 0, então adicionamos 1
  const ano = data.getFullYear();

  // Verifica se a data formatada é igual a "30/11/1899"
  const dataFormatada = `${dia}/${mes}/${ano}`;
  if (dataFormatada === '30/11/1899') {
      return ''; // Retorna uma string vazia se a data formatada for "30/11/1899"
  }

  // Retorna a data formatada
  return dataFormatada;
}
function convertToYYYYMMDD(dateStr) {
    if (dateStr !== null) {
        var parts = dateStr.split("/");
        if (parts.length === 3) {
            // As partes estão na ordem correta (dia, mês, ano) para a função Date
            var year = parts[2];
            var month = parts[1];
            var day = parts[0];

            // Garanta que o mês e o dia tenham dois dígitos (zero à esquerda, se necessário)
            if (month.length === 1) {
                month = "0" + month;
            }
            if (day.length === 1) {
                day = "0" + day;
            }

            // Retorne a data no formato "YYYY/MM/DD"
            return year + "/" + month + "/" + day;
        } else {
            // Se a entrada não estiver no formato esperado, retorne null ou outra indicação de erro
            return null;
        }
    } else {
        // Se dateStr for null, retorne null ou outra indicação de erro
        return null;
    }
}
function formatarComoNumero(valor) {
    // Substitui a vírgula (,) por um ponto (.) como separador decimal, se necessário
    valor = valor.replace('R$ ', '');
    // Substitui a vírgula (,) por um ponto (.) como separador decimal, se necessário
    valor = valor.replace(' ', '');
    // Substitui a vírgula (,) por um ponto (.) como separador decimal, se necessário
    valor = valor.replace(',', '.');

    // Retorna o valor como uma string formatada
    return valor;
}
function formatarYYYYMMDD(dataString) {
    // Crie um objeto Date a partir da string original
    var data = new Date(dataString);

    // Extraia as partes da data que você precisa
    var ano = data.getFullYear();
    var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adicione 1 ao mês, pois o mês é baseado em zero
    var dia = data.getDate().toString().padStart(2, '0');

    // Formate a data como "yyyy-MM-dd"
    return `${ano}-${mes}-${dia}`;
}
function maskMoney(selector) {
    $(selector).maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
}
function separadorMilhar(numero) {
    // Converte o número para string
    let numeroString = numero.toString();

    // Divide a string em parte inteira e parte decimal (se houver)
    let partes = numeroString.split('.');

    // Separa a parte inteira em grupos de três dígitos e adiciona um ponto entre eles
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Junta novamente a parte inteira e a parte decimal (se houver)
    return partes.join('.');
}
function formatarDataBRPraGringa(dataString) {
  // Divide a string da data nos componentes dia, mês e ano
  let partesData = dataString.split('/');

  // Obtém o dia, o mês (subtraindo 1 porque os meses em JavaScript são baseados em zero) e o ano
  let dia = partesData[0];
  let mes = partesData[1] - 1;
  let ano = partesData[2];

  // Cria uma nova instância de Date
  let data = new Date(ano, mes, dia);

  // Formata a data no formato "aaaa-mm-dd"
  let dataFormatada = data.getFullYear() + '-' +
                      ('0' + (data.getMonth() + 1)).slice(-2) + '-' +
                      ('0' + data.getDate()).slice(-2);

  return dataFormatada;
}
function formatarDataParaString(dataHoraString) {
    // Divide a string nos componentes de data e hora
    let partes = dataHoraString.split(' ');

    // Componente de data no formato "DD/MM/AAAA"
    let dataPartes = partes[0].split('/');
    let dataFormatada = `${dataPartes[2]}-${dataPartes[1]}-${dataPartes[0]}`;

    // Adiciona " 00:00:00.000" para representar a hora
    let dataHoraFormatada = `${dataFormatada} ${partes[1]}.000`;

    return dataHoraFormatada;
}
function limitaTexto(limite, data) {
  if (data) {
      if (data.length > limite) {
          return `<span>${data.substr(0, limite)}...</span>`;
      } else {
          return data;
      }
  }
}
function obtemPorcentagem(data) {
  var conta = (parseFloat(data) * 100).toFixed(2);
  var result = conta + '%';

  return result;
}
function revertePorcentagem(data) {
  data.replace('%', '');

  var result = parseFloat(data) / 100;

  return result;
}
function capitalize(data) {
  // Separe a string em palavras usando o espaço como delimitador
  let palavras = data.toLowerCase().split(' ');

  // Capitalize a primeira letra de cada palavra
  for (let i = 0; i < palavras.length; i++) {
      palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
  }

  // Junte as palavras de volta em uma string e retorne
  return palavras.join(' ');
}
function limparCamposExceto(excecoes) {
  // Obtém todos os campos de entrada do formulário
  const campos = document.querySelectorAll('input');

  // Itera sobre cada campo de entrada
  campos.forEach(campo => {
      // Verifica se o ID do campo não está na lista de exceções
      if (!excecoes.includes(campo.id)) {
          // Limpa o valor do campo
          campo.value = '';
      }
  });
}
function limparCampos(divId) {
  const div = document.getElementById(divId);

  // Limpar campos de entrada (input)
  div.querySelectorAll('input').forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false; // Desmarcar checkbox e radio buttons
      } else {
          input.value = ''; // Limpar valores dos outros tipos de input
      }
  });

  // Limpar campos de seleção (select), incluindo Select2
  div.querySelectorAll('select').forEach(select => {
      select.selectedIndex = 0; // Define a primeira opção como selecionada
      if ($(select).hasClass('select2-hidden-accessible')) {
          $(select).val(null).trigger('change'); // Resetar Select2
      }
  });

  // Limpar campos de texto (textarea)
  div.querySelectorAll('textarea').forEach(textarea => {
      textarea.value = '';
  });

  // Limpar campos do tipo date
  div.querySelectorAll('input[type="date"]').forEach(input => {
      input.value = ''; // Limpa a data
  });

  // Desmarcar checkbox e radio buttons
  div.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
      input.checked = false;
  });

  // Limpar campos de seleção múltipla
  div.querySelectorAll('select[multiple]').forEach(select => {
      select.selectedIndex = -1; // Desmarcar todas as opções
      if ($(select).hasClass('select2-hidden-accessible')) {
          $(select).val(null).trigger('change'); // Resetar Select2 múltiplo
      }
  });
}


//FRONT END DESIGNER
function ligarSpinner() {
    $.blockUI({
      message:
        '<div class="sk-wave mx-auto">' +
        '<div class="sk-rect sk-wave-rect"></div>' +
        '<div class="sk-rect sk-wave-rect"></div>' +
        '<div class="sk-rect sk-wave-rect"></div>' +
        '<div class="sk-rect sk-wave-rect"></div>' +
        '<div class="sk-rect sk-wave-rect"></div>' +
        '</div>',
      css: {
        backgroundColor: 'transparent',
        border: '0'
      },
      overlayCSS: {
        opacity: 0.5
      }
    });
}
function desligarSpinner() {
$.unblockUI();
}
function alertaSucesso(titulo, texto) {
return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
    allowOutsideClick: false
})
}
function alertaConfirmacao(titulo, texto, funcaoConfirmacao) {
  return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
  }).then((result) => {
      if (result.isConfirmed) {
          funcaoConfirmacao(true); // Passa true como argumento se confirmado
      } else {
          funcaoConfirmacao(false); // Passa false como argumento se cancelado
      }
  });
}
function alertaErroConfirmacao(titulo, texto, funcaoConfirmacao) {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'error',
    confirmButtonColor: '#d33',
    confirmButtonText: 'OK'
  }).then((result) => {
      if (result.isConfirmed) {
          funcaoConfirmacao(true); // Passa true como argumento se confirmado
      }
  });
}
function alertaSucessoConfirmacao(titulo, texto, funcaoConfirmacao) {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK'
  }).then((result) => {
      if (result.isConfirmed) {
          funcaoConfirmacao(true); // Passa true como argumento se confirmado
      }
  });
}
function alertaSucessoSemButton(titulo, texto) {
return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    allowOutsideClick: false
});
}
function alertaErro(title, text) {
return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonColor: '#d33',
    confirmButtonText: 'OK'
});
}
function alertaAtencao(title, text) {
return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonColor: '#f0ad4e',
    confirmButtonText: 'OK'
}).then((result) => {
    if (result.isConfirmed) {
      // Recarrega a página
      location.reload();
    }
  });
}
function alertaErroMotivacional(titulo) {
  const indiceAleatorio = Math.floor(Math.random() * mensagensDivertidas.length);
  const mensagemAleatoria = mensagensDivertidas[indiceAleatorio];

  Swal.fire({
    title: titulo,
    text: mensagemAleatoria,
    icon: 'error',
    allowOutsideClick: false
  }).then((result) => {
      if (result.isConfirmed) {
        // Recarrega a página
        window.location.href = "/venda";

      }
    });
}
function alertaSucessoDivertido(titulo, redirect) {
  const indiceAleatorio = Math.floor(Math.random() * mensagensSucesso.length);
  const mensagemAleatoria = mensagensSucesso[indiceAleatorio];

  Swal.fire({
    title: titulo,
    text: mensagemAleatoria,
    icon: 'success',
    allowOutsideClick: false
  }).then((result) => {
      if (result.isConfirmed) {
        // Recarrega a página
        window.location.href = redirect;
      }
    });
}
function alertaValidaDados(titulo, listaErros) {
// Constrói a mensagem de erro em HTML
let mensagemErro = "<ul>";
listaErros.forEach((erro) => {
  mensagemErro += `<li>${erro}</li>`;
});
mensagemErro += "</ul>";

Swal.fire({
  title: titulo,
  html: mensagemErro,
  icon: "error",
  allowOutsideClick: false,
  confirmButtonColor: "#3085d6",
  confirmButtonText: "Entendi!",
});
}
function copiarParaAreaDeTransferencia(elemento) {
  var selecion = document.getSelection();
  var range = document.createRange();
  range.selectNodeContents(elemento);
  selecion.removeAllRanges();
  selecion.addRange(range);

  try {
    document.execCommand('copy');
    selecion.removeAllRanges();
    CallToast('success', 'Copiado!', 'Resumo do Pedido copiado para a área de transferência.');

  } catch (e) {
    console.error('Falha ao copiar conteúdo:', e);
  }
}

const mensagensDivertidas = [
    "A venda foi mais rápida do que o Flash, mas você vai pegá-la da próxima vez! 💨😄",
    "Vendedor, a venda pode ter escapado, mas sua simpatia é inigualável! 😃👍",
    "Ei, o cliente deve ter fugido mais rápido do que um gato assustado! 😸😆",
    "Não se preocupe, vendedor, até o Batman perde um vilão de vez em quando! 🦸‍♂😁",
    "Parece que o cliente quis dar uma de Sherlock Holmes e desaparecer, mas você é um detetive de vendas incrível! 🔍🕵‍♂",
    "Vendedor, a venda pode ter escapado, mas você ainda é o herói das nossas vendas! 🦸‍♂💪",
    "A venda se transformou em uma viagem espacial, mas você é o astronauta das vendas! 🚀🌌",
    "Não se preocupe, vendedor, até mesmo o Super Mario perde um cogumelo de vez em quando! 🍄😆",
    "Ei, não foi uma venda perdida, foi uma 'venda adiada para a vitória'! 🏆😄",
    "Você é como um caçador de vendas, e essa venda apenas escapou do seu laço! 🤠🐎",
    "Parece que o cliente ficou com medo do seu superpoder de vendas! 💥💼",
    "Não se preocupe, vendedor, você está apenas guardando a venda para um momento mais emocionante! ⏳🎉",
    "A venda pode ter dado uma escapadinha, mas você é o mestre do retorno triunfal! 🏴‍☠🦜",
    "Ei, vendedor, até mesmo o James Bond perde um alvo de vez em quando! 🕶🔫",
    "A venda pode ter feito um 'moonwalk' para longe, mas você é o rei das vendas! 🕺👑",
    "Parece que o cliente teve um ataque de fobia de vendas, mas você é o terapeuta! 🛋🧘‍♂",
    "Não foi uma venda perdida, foi apenas uma venda fazendo uma 'pausa dramática' antes de voltar! 🍿🎬",
    "Vendedor, a venda pode ter desaparecido, mas você é o mago das vendas! 🎩✨",
    "A venda foi como uma piada ruim, mas você é o comediante das vendas! 🤣🎤",
    "Ei, vendedor, até mesmo o Indiana Jones perdeu artefatos valiosos! 🌴🗺"
];
const mensagensSucesso = [
    "Você está transformando vendas em uma obra-prima de Picasso! 🎨💼",
    "Essa venda foi mais emocionante do que um episódio de Game of Thrones! 🐉💼",
    "Se vendas fosse uma corrida, você seria o Usain Bolt do setor! 🏃‍♂️💨",
    "Você transformou esse orçamento em ouro, como se fosse o próprio Midas! 🏅💼",
    "Você está vendendo como o Gavião Arqueiro atira flechas: com precisão impecável! 🏹💼",
    "Você está derrubando barreiras nas vendas como o Shrek derruba dragões! 🐉💥💼",
    "Você é o bruxo das vendas, dominando o mercado com habilidades mágicas! 🧙‍♂️💼",
    "Você é o bruxo das vendas, transformando leads em poções de sucesso! 🔮💼",
    "Essa venda foi um verdadeiro golpe de mestre, digno de um episódio de 'Suits'! 💼👌",
    "Suas estratégias de vendas são tão imprevisíveis quanto os dribles de Ronaldinho Gaúcho! 🔄💼",
    "Você é o Neymar das vendas, driblando desafios e marcando gols de sucesso! ⚽🎉💼",
    "Você é como um antivírus das vendas, protegendo nossos lucros de ameaças competitivas. 🛡💼",,
    "Sua venda foi tão eficiente que até o servidor não deu timeout! ⏳💼",
    "Sua venda foi tão clara quanto um display de LED de alta resolução! 🖥🔆",
    "Comissões chegando como um carregamento de produtos frescos direto da China! 📦🏞",
    "Sua venda foi mais sólida do que a credibilidade do 'Pablo Marçal'. 💪💼",
    "Comissões chegando como um navio cargueiro de produtos frescos direto da China! 🚢🌏",
    "Vendendo como se estivéssemos em uma liquidação de Black Friday - rápido, furioso e deixando a concorrência no escuro! 🛍💡",
    "Cada venda que você faz é como um episódio de uma série de sucesso - sempre deixando todos ansiosos pelo próximo! 📺❤",
    "Você não apenas atingiu a meta, mas também fez a meta parecer que estava mirando muito baixo. Alvo superado! 🎯🚀"
];


//CALCULOS
function calcularTotal(qtdId, unitId, totalId) {
  // Obtém os valores dos campos de quantidade e valor unitário
  const qtd = parseFloat($(qtdId).val());
  const valorUni = parseFloatMoeda($(unitId).val());

  // Verifica se os valores são válidos
  if (!isNaN(qtd) && !isNaN(valorUni)) {
      // Calcula o total
      const total = qtd * valorUni;

      // Atualiza o valor do campo total
      $(totalId).val(moeda(parseFloat(total.toFixed(2)))); // Arredonda para 2 casas decimais
  }
}

//GENÉRICAS / VALIDAÇÕES

// Função para atualizar o select2 com os dados do cliente
function atualizarselect2(elementoSelect, texto, valor) {
    // Cria uma nova opção e a adiciona ao select2
    const novaOpcao = new Option(texto, valor, true, true);
    elementoSelect.append(novaOpcao).trigger('change');

    // Atualiza o valor do select2
    elementoSelect.val(valor).trigger('change');
}
function isFeriado(data) {
    // Pensar numa lógica depois
    return false; // Atualmente sempre retorna falso
}
function enviarLogParaServidor(mensagem) {
    fetch('util/enviarLog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logMessage: mensagem }),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Erro ao enviar log para o servidor:', response.status);
      }
    })
    .catch(error => {
      console.error('Erro ao enviar log para o servidor:', error);
    });
}
function enviarNotificacao(titulo, idUserDestino, idOrc = null, tipo, mensagem, slaMinutos = 0, Url = '', Acesso = null) {
let sla = '0000-00-00';

    if (slaMinutos > 0) {
      let slaDateTime = new Date(new Date().getTime() + (slaMinutos * 60000)); // Converte minutos em milissegundos
      sla = slaDateTime.toISOString().replace('T', ' ').replace('Z', '').split('.')[0] + '.' + slaDateTime.getMilliseconds();
    }

    $.ajax({
      url: '/notifications/insert-notification',
      method: 'POST',
      data: {
        Id_User_Destino: idUserDestino,
        Id_Orc: idOrc,
        Tipo: tipo,
        Mensagem: mensagem,
        Sla: sla,
        Status: 0,
        Id_User_Solicitante: userId,
        Lido: 0,
        Titulo: titulo,
        Url: Url,
        Acesso:Acesso
      },
      success: function (response) {
        // A notificação foi enviada com sucesso
      },
      error: function (error) {
        console.error(error);
      }
    });
}
function atualizarNotificacao(idOrc, lido, acao, mensagemRetorno) {
// Faça a chamada AJAX para atualizar os campos específicos da notificação
$.ajax({
    url: `/notifications/update/${idOrc}`, // Sua rota para atualizar a notificação
    method: 'PUT',
    data: {
    lido: lido, // Valor do campo Lido
    acao: acao, // Valor do campo Acao
    mensagemRetorno: mensagemRetorno, // Valor do campo Mensagem_Retorno (opcional)
    },
    success: function (response) {
    // Campos atualizados com sucesso
    console.log('Campos atualizados com sucesso.');
    },
    error: function (error) {
    console.error('Erro ao atualizar campos:', error);
    },
});
}
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function calcularFinanciamento(valorTotal, valorEntrada, taxaJurosAnual, periodo) {
  // Calcula o valor financiado (valor total menos o valor da entrada)
  const valorFinanciado = valorTotal - valorEntrada;

  // Calcula a taxa de juros mensal
  const taxaJurosMensal = taxaJurosAnual / 12 / 100;

  // Calcula a parcela mensal usando a fórmula da tabela Price
  const parcela = (valorFinanciado * taxaJurosMensal) / (1 - Math.pow(1 + taxaJurosMensal, -periodo));

  // Array para armazenar a tabela de amortização
  const tabelaAmortizacao = [];

  // Saldo devedor inicial é o valor financiado
  let saldoDevedor = valorFinanciado;

  // Calcula cada parcela e seus componentes (juros, amortização, saldo devedor)
  for (let i = 0; i <= periodo; i++) {
      // Calcula os juros para esta parcela
      const juros = saldoDevedor * taxaJurosMensal;

      // Calcula a amortização para esta parcela
      const amortizacao = parcela - juros;

      // Atualiza o saldo devedor após o pagamento desta parcela
      saldoDevedor -= amortizacao;

      // Adiciona os dados da parcela à tabela de amortização
      tabelaAmortizacao.push({
          "Nº": i,
          Parcela: parcela.toFixed(2),
          Juros: juros.toFixed(2),
          Amortizacao: amortizacao.toFixed(2),
          "Saldo Devedor": saldoDevedor.toFixed(2)
      });
  }

  // Retorna a tabela de amortização completa
  return tabelaAmortizacao;
}
function destacarCampoComErro(campo, mensagem) {
  campo.addClass('is-invalid');
  campo.focus();
  campo[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  alertaErro('Erro', mensagem);
}
// Verifica e destaca campos obrigatórios
function verificarCampoObrigatorio(selector, mensagem) {
const campo = $(selector);
if (campo.val() === '') {
    destacarCampoComErro(campo, mensagem);
    return false;
}
campo.removeClass('is-invalid'); // Remove a classe de erro se o campo estiver preenchido
return true;
}
// Função genérica para popular um select
function popularSelect(rota, selectId) {
  return new Promise((resolve, reject) => {
      $.ajax({
          url: rota,
          method: 'GET',
          success: function(data) {
              const select = document.getElementById(selectId);
              select.innerHTML = ''; // Limpar opções atuais
              data.forEach(item => {
                  const option = document.createElement('option');
                  option.value = item.value; // ou outro campo que você queira usar como valor
                  option.text = item.text; // ou outro campo que você queira usar como texto
                  select.appendChild(option);
              });
              resolve();
          },
          error: function(error) {
              console.error(`Erro ao carregar dados para ${selectId}:`, error);
              reject(error);
          }
      });
  });
}



// Inclua esta função na lista de exports
export { moeda_2, verificarCampoObrigatorio ,calcularFinanciamento, popularSelect, generateRandomString, copiarParaAreaDeTransferencia, formatarDataParaString, alertaSucessoConfirmacao, bigNumberMoeda, bigNumber, alertaErroMotivacional, alertaErroConfirmacao, alertaValidaDados, capitalize, calcularTotal, limparCamposExceto,alertaConfirmacao, alertaSucessoDivertido, limparCampos,enviarLogParaServidor, obtemPorcentagem, revertePorcentagem, limitaTexto, formatarDataBRPraGringa, moeda, maskMoney, separadorMilhar, enviarNotificacao, atualizarNotificacao, formatarComoNumero, tempoRealMoeda, formatarComoMoeda, parseFloatMoeda, ligarSpinner, desligarSpinner, alertaSucesso, alertaSucessoSemButton, alertaErro, alertaAtencao, validaNaN, isFeriado, atualizarselect2, formatarData, removerFormatacaoMaskMoney,convertToYYYYMMDD,formatarYYYYMMDD };
