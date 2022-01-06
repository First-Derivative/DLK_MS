// UI Functionality: Add Purchases Card
function addPurchases(new_purchases) {
  alerted = false
  for (const field of Object.entries(new_purchases)) {
    console.log(new_purchases[field[0]])
    if (new_purchases[field[0]] == (undefined || '')) { console.log("alerted"); alerted = true }
  }

  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-edit-${new_purchases.project_code}" style="padding-bottom: 0.2em" name="${new_purchases.project_code}" alt="Needs Entry"></div>`

  purchases_card_template =
    `<div class="card"  id="purchases-card-${new_purchases.purchase_order}" name="${new_purchases.purchase_order}">
      <div class="card-header d-flex flex-row justify-content-between" id="purchases-card-header-${new_purchases.purchase_order}">
        <p id="purchase_order_${new_purchases.purchase_order}">${new_purchases.purchase_order}</p>
        <div class="d-flex justify-content-between" id="card-header-icons">
          ${alerted ? alerted_tag : ''}
          <div class="col">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_purchases.purchase_order}" name="${new_purchases.purchase_order}" alt="Edit Entry">
          </div>
          <div class="col" style="padding-right: 0em;">
            <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_purchases.purchase_order}" name="${new_purchases.purchase_order}" alt="More Info">
          </div>
        </div>
      </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_purchases.purchase_order}">

      <div class="card_row">
        <p class="card-text" id="project_code_${new_purchases.purchase_order}">${new_purchases.project_code}</p>

        <p class="card-text" id="purchased_items_${new_purchases.purchase_order}">${new_purchases.purchased_items}</p>
        
        <p class="card-text value" id="invoice_amount_${new_purchases.purchase_order}">${new_purchases.invoice_amount}</p>
      </div>

      <div class="card_row">
        <p class="card-text ${(new_purchases.po_date == null || new_purchases.po_date == '') ? 'missing_text' : ''}" id="po_date_${new_purchases.purchase_order}" id="po_date_${new_purchases.purchase_order}"><span class="text-muted">Purchase Order Date: </span>${new_purchases.po_date == undefined ? 'null' : new_purchases.po_date}</p>

        <p class="card-text ${(new_purchases.supplier_name === '') ? 'missing_text' : ''}" id="supplier_name_${new_purchases.purchase_order}"><span class="text-muted">Purchases From Germany: </span>${new_purchases.supplier_name == '' ? 'null' : new_purchases.supplier_name}</p>

      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_purchases.purchase_order}">

      <p class="card-text ${(new_purchases.expected_date == '') ? 'missing_text' : ''}" id="expected_date_${new_purchases.purchase_order}"><span class="text-muted">Expected Payment Date: </span>${(new_purchases.expected_date == '') ? 'null' : new_purchases.expected_date}</p>

      <p class="card-text ${(new_purchases.supplier_date == '') ? 'missing_text' : ''}" id="supplier_date_${new_purchases.purchase_order}"><span class="text-muted">Supplier Delivary Date: </span>${(new_purchases.supplier_date == '') ? 'null' : new_purchases.supplier_date}</p>

    </div>
  </div>`

  // Prepend new_purchases Card to DOM
  $('#purchases_display').prepend(purchases_card_template)
  // Set new_purchases card css to display none
  $(`#card-footer-${new_purchases.project_code}`).css("display", "none")

  // Dropdown for purchases Card Handler
  dropdown_selector = "#card-dropdown-" + new_purchases.project_code
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).css('display') == "none") {
      $(`#card-footer-${id}`).show("fast")
    }
    else { $(`#card-footer-${id}`).hide("fast") }
  })



  // Edit button for purchases Card Handler
  edit_selector = "#card-edit-" + new_purchases.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    // enterEditMode(new_purchases.project_code)
  })

}