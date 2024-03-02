'use strict';
async function onConsult(){
  const email = $('#email').val()
  let consultButton = $('#buscarBtn');
  consultButton.prop('disabled', true);

  try {

    $('#icon-search').addClass('d-none');
    $('#icon-loading').removeClass('d-none');

    const { data } = await axios.post('/usuario/consultar', {
      email: email,
    })

    $('#icon-search').removeClass('d-none');
    $('#icon-loading').addClass('d-none');

    if (!data.success){
      data.errors.forEach(element => {
        //erros.push(element.msg)
        showMessage(element.msg, 'danger');
      });
    } else {
      if (data.result.outMensagem) {
        $('#result-table').addClass('d-none');
        showMessage(resp.data.result.outMensagem, 'warning');
      } else {
        $('#alert-list').addClass('d-none').text('')
        showResult(data.result)
      }
    }
    
  } catch (error) {
    console.error('Erro na solicitação:', error);
  }

}

function showMessage(message, msgType) {
  const alertList = $('#alert-list');
  alertList.removeClass();
  alertList.addClass('alert alert-' + msgType);
  alertList.append('<span>' + message + '</span><br>');

  
}

function showResult(result){
  const tableBody = $('#result-table tbody');

  tableBody.empty();

  result.forEach(itemList => {

    // <a href="/usuario/form/cadastrar/email=${itemList.email}" class="btn btn-outline-primary">Editar</a> &nbsp;
    // <a href="/usuario/reserva/new/email=${itemList.email}" class="btn btn-outline-primary">Fazer Reserva</a>

    const urlEditUser = '/usuario/form/cadastrar'
    const newRow = $('<tr>');
    newRow.append($('<td>').text(itemList.nome));
    newRow.append($('<td>').text(itemList.email));
    newRow.append($('<td>').text(itemList.celular));
    newRow.append($('<td>').html(
      `
      <a href="javascript:onclick=redirect('${urlEditUser}', '${itemList.email}')" class="btn btn-outline-primary">Editar</a> &nbsp;
      <a href="/usuario/reserva/new/email=${itemList.email}" class="btn btn-outline-primary">Fazer Reserva</a>
      `
    ));
    tableBody.append(newRow);
  })

  $('#result-table').removeClass('d-none');
}

function redirect(url, parametro){
  localStorage.setItem('email', parametro);
  window.location.href = url;
}

