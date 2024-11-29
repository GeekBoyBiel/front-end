import { ligarSpinner, desligarSpinner } from './util.js';

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

function converterDataISOparaBR(dataISO) {
  if (!dataISO) return '';

  const date = new Date(dataISO);
  if (!isValidDate(date)) return '';

  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function converterDataeHoraISOparaBR(dataISO) {
  if (!dataISO) return '';

  const date = new Date(dataISO);
  if (!isValidDate(date)) return '';

  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const hora = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
}

function calcularTempoDetalhado(dataInicio) {
  const inicio = new Date(dataInicio);
  if (!isValidDate(inicio)) return 'Data inválida';

  const fim = new Date();

  const diferencaMs = fim - inicio;
  const segundos = Math.floor(diferencaMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = fim.getMonth() - inicio.getMonth() + (fim.getFullYear() - inicio.getFullYear()) * 12;
  const anos = Math.floor(meses / 12);

  const restanteMeses = meses % 12;
  const restanteDias = dias % 30;
  const restanteHoras = horas % 24;
  const restanteMinutos = minutos % 60;
  const restanteSegundos = segundos % 60;

  if (anos > 0) return `Há ${anos} ${anos > 1 ? 'anos' : 'ano'} e ${restanteMeses} ${restanteMeses > 1 ? 'meses' : 'mês'}`;
  if (meses > 0) return `Há ${meses} ${meses > 1 ? 'meses' : 'mês'} e ${restanteDias} ${restanteDias > 1 ? 'dias' : 'dia'}`;
  if (dias > 0) return `Há ${dias} ${dias > 1 ? 'dias' : 'dia'} e ${restanteHoras} ${restanteHoras > 1 ? 'horas' : 'hora'}`;
  if (horas > 0) return `Há ${horas} ${horas > 1 ? 'horas' : 'hora'} e ${restanteMinutos} ${restanteMinutos > 1 ? 'minutos' : 'minuto'}`;
  if (minutos > 0) return `Há ${minutos} ${minutos > 1 ? 'minutos' : 'minuto'} e ${restanteSegundos} ${restanteSegundos > 1 ? 'segundos' : 'segundo'}`;
  return `Há ${segundos} ${segundos > 1 ? 'segundos' : 'segundo'}`;
}

// Restante do código
// ...

// Configuração de destaque do nav pills
$(document).ready(function() {
  $('.nav-link').on('click', function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    $('.card').removeClass('destacar');
    var target = $(this).data('target');
    var $targetCard = $(target);
    $targetCard.addClass('destacar');
    $('html, body').animate({
      scrollTop: $targetCard.offset().top
    }, 100);
  });
});

// Configuração de preenchimento de dados
$(document).ready(function() {
  ligarSpinner();

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var codigo = getParameterByName('codigo');
  $.ajax({
    url: '/cadastro_funcionarios/dados/' + codigo,
    method: 'GET',
    success: function(response) {
      preencherFormulario(response);
      desligarSpinner();
    },
    error: function(error) {
      console.error('Erro ao buscar dados do usuário:', error);
      desligarSpinner();
    }
  });

  function preencherFormulario(data) {
    const logs = (data[0].logs);

    $('.user-profile-img').attr('src', data[0].Imagem_Url);
    $('.Nome').text(data[0].Nome);
    $('.Cargo').text(data[0].Cargo);
    $('.Departamento').text(data[0].Departamento);
    $('.Membros_Departamento').text('(' + data[0].Membros + ' membros)');
    $('.Estado_Civil').text(data[0].Estado_Civil);
    $('.Admissao').text(converterDataISOparaBR(data[0].Admissao));
    $('.Acesso').text(data[0].Acesso);
    $('.Celular').text(data[0].Contato_Pessoal);
    $('.Status').text(data[0].Regime);
    $('.Usuario_Precifica').text(data[0].Usuario);
    $('.Email').text(data[0].Email_Pessoal);
    $('.Empresa').text(data[0].Identificacao);

    $('.CPF').text(data[0].CPF);
    $('.RG').text(data[0].RG);
    $('.CNPJ').text(data[0].CNPJ);
    $('.Aniversario').text(converterDataISOparaBR(data[0].Data_Nascimento));
    $('.calculo_Aniversario').text(' (' + calcularTempoDetalhado(data[0].Data_Nascimento) + ')');
    $('.Admissao').text(converterDataISOparaBR(data[0].Admissao));
    $('.calculo_Admissao').text(' (' + calcularTempoDetalhado(data[0].Admissao) + ')');
    $('.Escolaridade').text(data[0].Escolaridade);

    $('.Id_Usuario').text(data[0].Id_Usuario);
    $('.Usuario').text(data[0].Usuario);
    $('.Acesso').text(data[0].Acesso);
    $('.Ultimo_Acesso').text(converterDataeHoraISOparaBR(data[0].sessionId_Atualizacao));

    $('.CEP').text(data[0].CEP);
    $('.Rua').text(data[0].Rua);
    $('.Numero').text(data[0].Numero);
    $('.Complemento').text(data[0].Complemento);
    $('.Bairro').text(data[0].Bairro);
    $('.Cidade').text(data[0].Cidade);
    $('.UF').text(data[0].Estado);

    $('.Pessoal_Tel').text(data[0].Telefone);
    $('.Pessoal_Celular').text(data[0].Telefone);
    $('.Pessoal_Email').text(data[0].Email);

    $('.nome_emergencia1').text(data[0].Nome_Contato_1);
    $('.parentesco_emergencia1').text('(' + data[0].Grau_Parentesco_1 + ')');
    $('.tel_emergencia1').text(data[0].Telefone_1);
    $('.celular_emergencia1').text(data[0].Telefone_1);

    $('.nome_emergencia2').text(data[0].Nome_Contato_2);
    $('.parentesco_emergencia2').text('(' + data[0].Grau_Parentesco_2 + ')');
    $('.tel_emergencia2').text(data[0].Telefone_2);
    $('.celular_emergencia2').text(data[0].Telefone_2);

    $('.Pai').text(data[0].Nome_Pai);
    $('.Mae').text(data[0].Nome_Mae);
    $('.celular_emergencia2').text(data[0].Telefone_2);

    const timelineContainer = $('.timeline');
    timelineContainer.empty(); // Limpa a linha do tempo atual

    logs.forEach(log => {
      const timelineItem = `
        <li class="timeline-item timeline-item-transparent">
          <span class="timeline-point-wrapper">
            <span class="timeline-point timeline-point-info"></span>
          </span>
          <div class="timeline-event">
            <div class="timeline-header mb-1">
              <h6 class="mb-0">${log.Atividade}</h6>
              <small class="text-muted">${calcularTempoDetalhado(log.Data_Atividade)}</small>
            </div>
            <div class="timeline-body">
              <p>Rota acessada: ${log.Rota_Acessada}</p>
            </div>
          </div>
        </li>
      `;
      timelineContainer.append(timelineItem);
    });
  }
});

document.getElementById('editButton').addEventListener('click', function() {
  document.querySelectorAll('[contenteditable]').forEach(element => {
    element.setAttribute('data-original-value', element.innerText);  // Salva o valor original
    element.setAttribute('contenteditable', 'true');
  });

  document.querySelectorAll('.Estado_Civil').forEach(element => {
    let select = document.querySelector('.Estado_Civil_select');
    select.value = element.innerText;  // Define o valor atual no select
    element.style.display = 'none';
    select.style.display = 'inline-block';
  });

  document.getElementById('editButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'block';
});

document.getElementById('saveButton').addEventListener('click', function() {
  document.querySelectorAll('[contenteditable]').forEach(element => {
    element.setAttribute('contenteditable', 'false');
  });

  document.querySelectorAll('.Estado_Civil_select').forEach(select => {
    let span = document.querySelector('.Estado_Civil');
    if (select.value !== span.getAttribute('data-original-value')) {
      span.innerText = select.value;  // Atualiza o valor no span
      updateField(span);
    }
    select.style.display = 'none';
    span.style.display = 'inline-block';
  });

  document.getElementById('editButton').style.display = 'block';
  document.getElementById('saveButton').style.display = 'none';
});

document.querySelectorAll('[contenteditable]').forEach(element => {
  element.addEventListener('blur', function() {
    if (element.innerText !== element.getAttribute('data-original-value')) {
      updateField(element);
    }
  });
  element.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();  // Evita a inserção de nova linha
      element.blur();
    } else if (event.key === 'Escape') {
      element.innerText = element.getAttribute('data-original-value');  // Restaura o valor original
      element.blur();
    }
  });
});

function updateField(element) {
  const field = element.className.split(' ')[0];
  let value = element.innerText;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const dateParts = value.split('/');
    if (dateParts.length === 3) {
      value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
  }

  fetch('/cadastro_funcionarios/update/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ field: field, value: value })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      CallToast('success', 'Campo atualizado com sucesso!');
    } else {
      const errorMessage = data.message || 'Falha ao atualizar o campo.';
      CallToast('error', 'Erro', `Falha ao atualizar o campo: ${errorMessage}`);
    }
  })
  .catch(error => {
    console.error('Erro ao atualizar o campo:', error);
    CallToast('error', 'Erro', `Ocorreu um erro ao atualizar o campo: ${error.message}`);
  });
}

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function updateCalendarHeader(year, month) {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;
}

function generateCalendar(year, month, data) {
  console.log(year, month, data);
  const calendar = document.querySelector('.calendar');
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  calendar.innerHTML = `
    <div class="calendar-day">Domingo</div>
    <div class="calendar-day">Segunda-Feira</div>
    <div class="calendar-day">Terça-Feira</div>
    <div class="calendar-day">Quarta-Feira</div>
    <div class="calendar-day">Quinta-Feira</div>
    <div class="calendar-day">Sexta-Feira</div>
    <div class="calendar-day">Sábado</div>
  `;

  for (let i = 0; i < firstDay; i++) {
    calendar.insertAdjacentHTML('beforeend', '<div class="calendar-cell empty-cell"></div>');
  }

  const formatTime = (time) => time ? time.slice(0, 5) : '';

  for (let day = 1; day <= lastDay; day++) {
    const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = data.find(d => {
      const dataRegistro = new Date(d.data_registro);
      const dataRegistroStr = `${dataRegistro.getFullYear()}-${String(dataRegistro.getMonth() + 1).padStart(2, '0')}-${String(dataRegistro.getDate()).padStart(2, '0')}`;
      return dataRegistroStr === currentDateStr;
    }) || {};

    const { entrada_1, saida_1, entrada_2, saida_2, entrada_3, saida_3, Detalhes, Tipo_de_Ausencia, aprovacao_data_solicitacao, aprovacao_data_aprovacao, aprovador_nome, Descricao_Feriado } = dayData;

    const pointInfo = `
      <div class="day-number">${day}</div>
      <div class="point-info ${!entrada_1 && !saida_1 && !entrada_2 && !saida_2 && !entrada_3 && !saida_3 && !Detalhes && !Tipo_de_Ausencia && !Descricao_Feriado ? 'hidden' : ''}">
        <div class="row ps-1">
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(entrada_1) || ''}</small></div>
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(saida_1) || ''}</small></div>
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(entrada_2) || ''}</small></div>
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(saida_2) || ''}</small></div>
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(entrada_3) || ''}</small></div>
          <div class="col-2 ps-0 pe-0"><small class="hora-ponto">${formatTime(saida_3) || ''}</small></div>
        </div>
        <div class="row">
          <div class="col-6 pe-0 ps-1" style="border-right: 1px solid #e6e6e6">
            <div class="col-12 d-flex justify-content-center">
                <small>${Tipo_de_Ausencia || ''}</small>
            </div>
            <div class="col-12 d-flex justify-content-center">
                <span class="tiny">${Detalhes || ''}</span>
            </div>
          </div>
          <div class="col-6 ps-0 pe-2">
            <div class="col-12 d-flex justify-content-between">
              <span class="tiny">${Descricao_Feriado || ''}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    calendar.insertAdjacentHTML('beforeend', `<div class="calendar-cell">${pointInfo}</div>`);
  }
  updateCalendarHeader(year, month);
}

async function fetchCalendarData(userId) {
  try {
    const response = await fetch(`/cadastro_funcionarios/get-calendar-data/${userId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Erro ao buscar dados do calendário:', err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const userId = '5f3c3e5181bb210e8c1e1947';
  const data = await fetchCalendarData(userId);
  generateCalendar(currentYear, currentMonth, data);
});

document.getElementById('prev-month').addEventListener('click', async () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  const userId = '5f3c3e5181bb210e8c1e1947';
  const data = await fetchCalendarData(userId);
  generateCalendar(currentYear, currentMonth, data);
});

document.getElementById('next-month').addEventListener('click', async () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  const userId = '5f3c3e5181bb210e8c1e1947';
  const data = await fetchCalendarData(userId);
  generateCalendar(currentYear, currentMonth, data);
});

generateCalendar(currentYear, currentMonth);

document.getElementById('uploadAnexos').addEventListener('click', function() {
  const formData = new FormData(document.getElementById('formAnexos'));
  fetch('/cadastro_funcionarios/upload-anexos', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Arquivos anexados com sucesso!');
      // Atualizar a lista de anexos
      const listaAnexos = document.getElementById('listaAnexos');
      data.anexos.forEach(anexo => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerText = anexo.nome;
        listaAnexos.appendChild(listItem);
      });
    } else {
      alert('Erro ao anexar arquivos: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Erro ao anexar arquivos:', error);
    alert('Erro ao anexar arquivos.');
  });
});

document.getElementById('formNovoFuncionario').addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio automático
});


//Adicionar novo contato
document.getElementById('adicionarContato').addEventListener('click', () => {
    let contatoIndex = 1;
    const container = document.getElementById('contatosEmergenciaContainer');
    const contatoHTML = `
        <div class="contato-emergencia row mb-2">
            <div class="col-md-4">
                <input type="text" class="form-control" name="contatosEmergencia[${contatoIndex}][nome]" placeholder="Nome" required>
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" name="contatosEmergencia[${contatoIndex}][parentesco]" placeholder="Parentesco" required>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" name="contatosEmergencia[${contatoIndex}][telefone]" placeholder="Telefone" required>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm removerContato"><i class="bx bx-trash"></i></button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', contatoHTML);
    contatoIndex++;
});

// Remover contato
document.getElementById('contatosEmergenciaContainer').addEventListener('click', (event) => {
    if (event.target.closest('.removerContato')) {
        event.target.closest('.contato-emergencia').remove();
    }
});

document.addEventListener("DOMContentLoaded", function () {
  const selectEmpresa = document.getElementById("empresa");

  // Função para buscar empresas do endpoint
  function carregarEmpresas() {
    fetch("/getEmpresas", {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          // Limpar opções existentes (exceto a primeira)
          selectEmpresa.innerHTML = '<option value="">Selecione uma opção</option>';
          
          // Adicionar novas opções
          data.data.forEach(empresa => {
            const option = document.createElement("option");
            option.value = empresa.id; // Define o valor da opção
            option.textContent = empresa.text; // Define o texto visível
            selectEmpresa.appendChild(option);
          });
        } else {
          console.error("Erro ao carregar empresas:", data.message);
        }
      })
      .catch(error => {
        console.error("Erro ao conectar ao servidor:", error);
      });
  }

  // Carregar empresas ao inicializar a página
  carregarEmpresas();
});
