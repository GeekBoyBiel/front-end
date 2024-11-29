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