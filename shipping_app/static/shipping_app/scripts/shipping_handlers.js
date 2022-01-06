// UI Functionality: Add Shipping Card
function addShipping(new_shipping) {
  alerted = false
  for (const field of Object.entries(new_shipping)) {
    console.log(new_shipping[field[0]])
    if (new_shipping[field[0]] == (undefined || '')) { console.log("alerted"); alerted = true }
  }

  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-edit-${new_shipping.project_code}" style="padding-bottom: 0.2em" name="${new_shipping.project_code}" alt="Needs Entry"></div>`

  shipping_card_template =
    `<div class="card ${new_shipping.cancelled ? 'cancelled-card' : ''} ${new_shipping.completed ? 'completed-card' : ''}"  id="shipping-card-${new_shipping.project_code}" name="${new_shipping.project_code}">
      <div class="card-header ${new_shipping.cancelled ? 'cancelled-card-header' : ''} ${new_shipping.completed ? 'completed-card-header' : ''} d-flex flex-row justify-content-between" id="shipping-card-header-${new_shipping.project_code}">
        <p id="project_code_${new_shipping.project_code}">${new_shipping.project_code}</p>
        <div class="d-flex justify-content-between" id="card-header-icons">
          ${alerted ? alerted_tag : ''}
          <div class="col">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_shipping.project_code}" name="${new_shipping.project_code}" alt="Edit Entry">
          </div>
          <div class="col" style="padding-right: 0em;">
            <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_shipping.project_code}" name="${new_shipping.project_code}" alt="More Info">
          </div>
        </div>
      </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_shipping.project_code}">

      <div class="card_row">
        <p class="card-text" id="project_name_${new_shipping.project_code}">${new_shipping.project_name}</p>

        <p class="card-text" id="client_name_${new_shipping.project_code}">${new_shipping.client_name}</p>
      </div>

      <div class="card_row">
        <p class="card-text ${(new_shipping.charges == null || new_shipping.charges == '') ? 'missing_text' : ''}" id="charges_${new_shipping.project_code}" id="charges_${new_shipping.project_code}"><span class="text-muted">Charges: </span>${new_shipping.charges == undefined ? 'null' : new_shipping.charges}</p>

        <p class="card-text ${(new_shipping.germany === '') ? 'missing_text' : ''}" id="germany_${new_shipping.project_code}"><span class="text-muted">Shipping From Germany: </span>${new_shipping.germany == '' ? 'null' : new_shipping.germany}</p>

        <p class="card-text ${(new_shipping.customer == null || new_shipping.customer == '') ? 'missing_text' : ''}" id="customer_${new_shipping.project_code}"><span class="text-muted">Shipping From Customer: </span>${new_shipping.customer == '' ? 'null' : new_shipping.customer}</p>
      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_shipping.project_code}">
      <p class="card-text ${(new_shipping.remarks == '') ? 'missing_text' : ''}" id="remarks_${new_shipping.project_code}"><span class="text-muted">Remarks: </span>${(new_shipping.remarks == '') ? 'null' : new_shipping.remarks}</p>

      <p class="card-text" id="cancelled_${new_shipping.project_code}"><span class="text-muted">Cancelled: </span>${new_shipping.cancelled ? 'True' : 'False'}</p>

      <p class="card-text" id="completed_${new_shipping.project_code}"><span class="text-muted">Completed: </span>${new_shipping.completed ? 'True' : 'False'}</p>
    </div>
  </div>`

  // Prepend new_shipping Card to DOM
  $('#shipping_display').prepend(shipping_card_template)
  // Set new_shipping card css to display none
  $(`#card-footer-${new_shipping.project_code}`).css("display", "none")

  // Dropdown for shipping Card Handler
  dropdown_selector = "#card-dropdown-" + new_shipping.project_code
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).css('display') == "none") {
      $(`#card-footer-${id}`).show("fast")
    }
    else { $(`#card-footer-${id}`).hide("fast") }
  })



  // Edit button for shipping Card Handler
  edit_selector = "#card-edit-" + new_shipping.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    // enterEditMode(new_shipping.project_code)
  })

}