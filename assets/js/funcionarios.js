import { moeda, ligarSpinner, desligarSpinner, formatarData, capitalize, limparCamposExceto, maskMoney, parseFloatMoeda, calcularTotal, formatarComoMoeda, moeda_2 } from './util.js';

$(function () {
  ligarSpinner();
  var dt_filter_table = $('.dt-column-search');

  function filterColumn(i, val) {
    if (i == 5) {
      if (startDate !== '' && endDate !== '') {
        $.fn.dataTableExt.afnFiltering.length = 0;
        dt_filter_table.dataTable().fnDraw();
      }
      dt_filter_table.dataTable().fnDraw();
    } else {
      dt_filter_table.DataTable().column(i).search(val, false, true).draw();
    }
  }

  if (dt_filter_table.length) {
    var dt_filter = dt_filter_table.DataTable({
      ajax: {
        url: '/funcionarios/dados/',
        complete: function () {
          desligarSpinner();
        }
      },
      columns: [
        {
          data: 'Imagem_Url', width: '5%',
          render: function (data, type, row) {
            return '<img src="' + data + '" alt="Imagem" class="rounded-circle w-px-40 h-px-40"/>';
          }
        },
        { data: 'Id_Usuario', width: '5%', className: "text-center" },
        { data: 'Nome', className: "text-start" },
        { data: 'Cargo' },
        {
          data: 'Ativo', width: '5%',
          render: function (data, type, row) {
            if (data === -1) {
              return 'Ativo';
            } else if (data === 0) {
              return 'Desligado';
            }
            return data;
          }
        },
        {
          data: 'Id_Usuario',
          render: function (data, type, row) {
            return type === 'display' ? botaoacao(row.Id_Usuario) : data;
          },
          orderable: false
        },
      ],
      scrollX: false,
      orderCellsTop: true,
      searching: true,
      lengthChange: false,
      responsive: true,
      order: [[0, "desc"]],
      pageLength: 100,
      language: {
        lengthMenu: "Exibir _MENU_ registros por página",
        zeroRecords: "Nenhum registro encontrado",
        info: "Mostrando página _PAGE_ de _PAGES_",
        infoEmpty: "Nenhum registro disponível",
        infoFiltered: "(filtrado de _MAX_ registros no total)",
        search: "Procurar:",
        paginate: {
          previous: "Anterior",
          next: "Próximo",
        },
      },
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
  }

  $('input.dt-input').on('keyup', function () {
    filterColumn($(this).attr('data-column'), $(this).val());
  });

  $('#imageUpload').change(function () {
    readURL(this);
  });

  carregarSelect('/funcionarios/getTiposDocumento', '#tipo_documento');
  carregarSelect('/funcionarios/getEmpresas', '#empresa');
  carregarSelect('/funcionarios/getRegimes', '#regime');
  carregarSelect('/funcionarios/getCargos', '#cargo');
  carregarSelect('/funcionarios/getSetores', '#setor');
  carregarSelect('/funcionarios/getFuncoes', '#funcao');
  carregarSelect('/funcionarios/getEstados', '#estado_nascimento');
  carregarSelect('/funcionarios/getEstados', '#estado');
  carregarSelect('/funcionarios/getGeneros', '#genero');
  carregarSelect('/funcionarios/getEscolaridades', '#escolaridade');
  carregarSelect('/funcionarios/getGrauParentesco', '#grau_parentesco_1');
  carregarSelect('/funcionarios/getGrauParentesco', '#grau_parentesco_2');

  $('#estado').change(function () {
    const estadoId = $(this).val();
    carregarSelect(`/funcionarios/getCidades/${estadoId}`, '#cidade');
  });

  $('#estado_nascimento').change(function () {
    const estadoId = $(this).val();
    carregarSelect(`/funcionarios/getCidades/${estadoId}`, '#cidade_nascimento');
  });

  $('#cep').change(function () {
    const cep = $(this).val();
    if (cep.length === 8) {
      buscarEnderecoPorCep(cep);
    }
  });
});

function carregarSelect(url, selectId, defaultOption = "Selecione", callback) {
  $.getJSON(url, function (data) {
    const select = $(selectId);
    select.empty();
    select.append(new Option(defaultOption, ""));
    data.forEach(item => {
      select.append(new Option(item.text, item.id));
    });
    select.trigger('change');
    if (callback) callback();
  });
}

function carregarSelectComCallback(url, selectId, defaultOption = "Selecione", callback) {
  $.getJSON(url, function (data) {
    const select = $(selectId);
    select.empty();
    select.append(new Option(defaultOption, ""));
    data.forEach(item => {
      select.append(new Option(item.text, item.id));
    });
    select.trigger('change');
    if (callback) callback();
  });
}

function buscarEnderecoPorCep(cep) {
  $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
    if (!data.erro) {
      console.log(data);
      $('#rua').val(data.logradouro);
      $('#bairro').val(data.bairro);
      $.getJSON(`/funcionarios/getEstadoIdBySigla/${data.uf}`, function (estadoData) {
        const estadoId = estadoData.id;
        $('#estado').val(estadoId).trigger('change');
        carregarSelectComCallback(`/funcionarios/getCidades/${estadoId}`, '#cidade', 'Selecione a cidade', function () {
          const cidade = data.localidade;
          $('#cidade option').each(function () {
            if ($(this).text() === cidade) {
              $(this).prop('selected', true);
              return false;
            }
          });
          $('#cidade').trigger('change');
        });
      });
    }
  });
}

function botaoacao(codigo, id) {
  return `
    <div class="btn-group">
      <a href="cadastro_funcionarios?codigo=${codigo}&id=${id}" class="btn">
        <i class="bx bx-detail" style="color:#696cff;font-size: 20px;"></i>
      </a>
    </div>
  `;
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

document.getElementById('funcionarioForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    event.stopPropagation();
    alert('Por favor, preencha todos os campos obrigatórios.');

    const firstInvalidField = form.querySelector(':invalid');
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidField.focus();
    }
  } else {
    const formData = new FormData(form);

    // Adicionando campos manualmente ao formData
    formData.append('nome', $('#nome').val());
    formData.append('data_admissao', $('#data_admissao').val());
    formData.append('cpf', $('#cpf').val());
    formData.append('rg', $('#rg').val());
    formData.append('nome_mae', $('#nome_mae').val());
    formData.append('nome_pai', $('#nome_pai').val());
    formData.append('cidade_nascimento', $('#cidade_nascimento').val());
    formData.append('estado_nascimento', $('#estado_nascimento').val());
    formData.append('escolaridade', $('#escolaridade').val());
    formData.append('genero', $('#genero').val());
    formData.append('data_nascimento', $('#data_nascimento').val());
    formData.append('regime', $('#regime').val());
    formData.append('telefone', $('#telefone').val());
    formData.append('email', $('#email').val());
    formData.append('cargo', $('#cargo').val());
    formData.append('empresa', $('#empresa').val());
    formData.append('setor', $('#setor').val());
    formData.append('rua', $('#rua').val());
    formData.append('numero', $('#numero').val());
    formData.append('complemento', $('#complemento').val());
    formData.append('bairro', $('#bairro').val());
    formData.append('cidade', $('#cidade').val());
    formData.append('estado', $('#estado').val());
    formData.append('cep', $('#cep').val());
    formData.append('usuario_precifica', $('#usuario_precifica').val());
    formData.append('funcao', $('#funcao').val());

    const contatosEmergencia = [
      {
        nome: $('#nome_contato_1').val(),
        parentesco: $('#grau_parentesco_1').val(),
        telefone: $('#telefone_contato_1').val()
      },
      {
        nome: $('#nome_contato_2').val(),
        parentesco: $('#grau_parentesco_2').val(),
        telefone: $('#telefone_contato_2').val()
      }
    ];

    formData.append('contatosEmergencia', JSON.stringify(contatosEmergencia));

    $.ajax({
      url: '/funcionarios/novo-colaborador',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          alert('Funcionário adicionado com sucesso!');
          $('#novoFuncionario').modal('hide');
          location.reload();
        } else {
          alert(response.error || 'Erro ao adicionar funcionário.');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Erro ao adicionar funcionário:', textStatus, errorThrown);
        alert('Erro ao adicionar funcionário.');
      }
    });
  }

  form.classList.add('was-validated');
});
