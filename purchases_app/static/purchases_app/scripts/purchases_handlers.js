// ===== AUXILIARY FUNCTIONS =====
function start(){
  cache.clearLibrary()
  $.when(getAllPurchases(addPurchases)).done(function () {
  })
}

function propertyToTitle(property)
{
  format = property.split("_")
  for( i = 0; i < format.length; i ++)
  {
    format[i] = format[i].charAt(0).toUpperCase() + format[i].substr(1, format[i].length)
  }
  return format.join(" ")
}

function resolveCurrency(currency) {
  switch (currency) {
    case "MYR": return "RM";
    case "EUR": return "€";
    case "USD": return "$";
    default: return "ERROR";
  }
}

// ===== UI ADD/REMOVE =====

// UI Functionality: Add Purchases Card
function addPurchases(new_purchases, prepend=false) {
  if($(`.card[name*='${new_purchases.purchase_order}']`).length > 0){
    return
  }
  
  alerted = false
  if(new_purchases.supplier_name_isNull || new_purchases.supplier_date_isNull || new_purchases.po_date_isNull || new_purchases.expected_date_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-alert-${new_purchases.project_code}" style="padding-bottom: 0.2em" name="${new_purchases.project_code}" alt="Needs Entry"></div>`

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
        <p class="card-text ${new_purchases.po_date_isNull ? 'missing_text' : ''}" id="po_date_${new_purchases.purchase_order}" id="po_date_${new_purchases.purchase_order}"><span class="text-muted">Purchase Order Date: </span>${new_purchases.po_date_isNull? 'null' : new_purchases.po_date}</p>

        <p class="card-text ${new_purchases.supplier_name_isNull ? 'missing_text' : ''}" id="supplier_name_${new_purchases.purchase_order}"><span class="text-muted">Purchases From: </span>${new_purchases.supplier_name_isNull ? 'null' : new_purchases.supplier_name}</p>

      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_purchases.purchase_order}">

      <p class="card-text ${new_purchases.expected_date_isNull ? 'missing_text' : ''}" id="expected_date_${new_purchases.purchase_order}"><span class="text-muted">Expected Payment Date: </span>${new_purchases.expected_date_isNull ? 'null' : new_purchases.expected_date}</p>

      <p class="card-text ${new_purchases.supplier_date_isNull ? 'missing_text' : ''}" id="supplier_date_${new_purchases.purchase_order}"><span class="text-muted">Supplier Delivary Date: </span>${new_purchases.supplier_date_isNull ? 'null' : new_purchases.supplier_date}</p>

    </div>
  </div>`

  // Adding New Purchases Card to page
  if(prepend){ $('#purchases_display').prepend(purchases_card_template) }
  else{ $('#purchases_display').append(purchases_card_template) }

  // Set new_purchases card css to display none
  $(`#card-footer-${new_purchases.purchase_order}`).css("display", "none")

  // Dropdown for purchases Card Handler
  dropdown_selector = "#card-dropdown-" + new_purchases.purchase_order
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).css('display') == "none") {
      $(`#card-footer-${id}`).show("fast")
    }
    else { $(`#card-footer-${id}`).hide("fast") }
  })

  // Edit button for purchases Card Handler
  edit_selector = "#card-edit-" + new_purchases.purchase_order
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    // enterEditMode(new_purchases.project_code)
  })

}

// UI Functionality: Remove all Purchases Cards
function removeAllPurchases()
{
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#purchases_display").empty()
}

function removePurchases(purchase_order)
{
  $(`div[id*='${purchase_order}']`).off() // unbinds handlers
  $(`div[id*='${purchase_order}']`).remove()
}

// ===== ADD ENTRY FEATURE =====

// Add Purchases Handler
$("#modal-btn-save").click(function () {

  new_purchases = {}

  $("input[class*=input-error-highlight]").each(function () {
    $(this).removeClass("input-error-highlight")
  })

  $("#modal-errors").empty()

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addPurchases]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if( property == "po_date" )
    {
      // Client: MM/DD/YYYY -> Server: YYYY-MM-DD
      raw = field.value
      raw = raw.replace("/", "-")
      raw = raw.replace("/", "-")
      raw_array = raw.split("-")

      raw_array.reverse()
      temp = raw_array[1]
      raw_array[1] = raw_array[2]
      raw_array[2] = temp
      
      formatted_date = raw_array.join("-")
      new_purchases[property] = formatted_date
    }
    else{ new_purchases[property] = field.value }
    
  })
  postPurchases(cache, new_purchases)
})
// ===== SEARCH FEAURE =====

// UX Functionality: Enter 'search mode' on enter key
$("#left_content_form").on("keypress", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 13)  {// Enter Key
    event.preventDefault();
    
    if (!search_mode) { // check if already in search mode, if false then enter and start search
      enterSearch()
    }
    else {
      removeAllPurchases()
    }
    
    const search_header_template = `
    <div class="row" id="searchHeader">
    <div class="header_title">
    </div>
    </div>
    `
    $("#purchases_display").prepend(search_header_template)
    
    const input_value = $("#input-search").val()
    searchPurchases(input_value, cache)
    return false;
  }
})

// UX Functionality: Leave 'search mode' on clear button press
$("#input-search-clear").click(function(){
  leaveSearch()
})

// UX Functionality: Leave 'search mode' ALT Trigger:  escape key
$("#left_content_form").on("keyup", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 27) {
    if (search_mode) { leaveSearch() } // check if already out of search mode
  }
})

// Enter Search
function enterSearch()
{
  search_mode = true
  removeAllPurchases()
  return true
}

// Leave Search
function leaveSearch()
{
  if ( $("#input-search-clear").hasClass("purchases_standard-btn-danger") ){ $("#input-search-clear").removeClass("purchases_standard-btn-danger")}
  $("#input-search").val("")
  search_mode = false
  removeAllPurchases()
  start()
}

// ===== FILTERING TOGGLES =====

// Reverse List Button
$("#reverse-list").click(function () {
  $("#purchases_display").children().each(function () {
    $("#purchases_display").prepend($(this))
  })
})