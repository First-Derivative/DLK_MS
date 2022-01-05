
/*
// Post Operations Handler
$("postOperations_confirm").click(function()
{
  // Init
  new_operations = {project_code=null, project_name=null, client_name=null, status=null, finish_detail=null, cancelled=null}

  // Get & Assign Data
  let form_data = $("form").serializeArray()
  $.each(form_data, function(i, field)
  {
    property = field.name
    new_operations.property = field.value
  })

  // Calls Ajax postOperations
  postOperations(new_operations)
})
*/

// UI Functionality: Add Operations
function addOperations(new_operations) {
  alerted = false
  for (const field of Object.entries(new_operations)) {
    if (new_operations[field[0]] === '') { alerted = true }
  }

  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" class="hoverable" id="card-edit-${new_operations.project_code}" style="padding-bottom: 0.2em;margin-right: 0.5em" name="${new_operations.project_code}" alt="Needs Entry"></div>`

  operations_card_template =
    `<div class="card ${new_operations.cancelled ? 'cancelled-card' : ''} " id="sales-card-${new_operations.project_code}" name="${new_operations.project_code}">
    <div class="card-header ${new_operations.cancelled ? 'cancelled-card-header' : ''} d-flex flex-row justify-content-between" id="sales-card-header-${new_operations.project_code}">
      <p id="project_code_${new_operations.project_code}">${new_operations.project_code}</p>
      <div class="d-flex justify-content-between" ">
        ${alerted ? alerted_tag : ''}
        <div class="col">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_operations.project_code}" name="${new_operations.project_code}" alt="Edit Entry">
        </div>
      </div>
    </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_operations.project_code}">
      <div class="card_row">
        <p class="card-text" id="project_name_${new_operations.project_code}">${new_operations.project_name}</p>
        <p class="card-text" id="client_name_${new_operations.project_code}">${new_operations.client_name}</p>
        <p class="card-text" id="finish_detail_${new_operations.project_code}">${new_operations.finish_detail}</p>
      </div>
      <div class="card_row">
        <p class="card-text ${(new_operations.status == '') ? 'missing_text' : ''}" id="status_${new_operations.project_code}"><span class="text-muted ">Status: </span>${new_operations.status == '' ? 'null' : ''}</p>
        <p class="card-text" id="cancelled_${new_operations.project_code}"><span class="text-muted">Cancelled: </span>${new_operations.cancelled ? 'True' : 'False'}</p>
      </div>
    </div>
  </div>`

  // Prepend new_sale Card to DOM
  $('#operations_display').prepend(operations_card_template)

  /*
  // Edit button for sales Card Handler
  edit_selector = "#card-edit-" + new_sale.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    enterEditMode(new_sale.project_code)
  })
  */
}