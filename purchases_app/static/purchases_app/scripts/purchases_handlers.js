// ===== AUXILIARY FUNCTIONS =====
function start(library) {
  library.clearLibrary()
  getAllPurchases().then((response) => {
    purchases = response.purchases
    purchases_count = purchases.length

    for (i = 0; i < purchases_count; i++) {
      content = purchases.pop()
      library.append(content)
      addPurchases(content)
    }
  }).catch((error) => {
    $(`purchases_display`).append(`<p class="h5 text-danger> Get Purchases Error: Please report bug with the text: ${error} </p>`)
  })
}

function propertyToTitle(property) {
  format = property.split("_")
  for (i = 0; i < format.length; i++) {
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

$(`#page_down`).click(function () {
  window.scrollTo(0, document.body.scrollHeight);
})

$(`#page_up`).click(function () {
  window.scrollTo(document.body.scrollHeight, 0);
})

// ===== UI ADD/REMOVE =====

function getTemplate(new_purchases)
{
  alerted = false
  if (new_purchases.supplier_name_isNull || new_purchases.supplier_date_isNull || new_purchases.po_date_isNull || new_purchases.expected_date_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-alert-${new_purchases.purchases_id}" style="padding-bottom: 0.2em" name="${new_purchases.purchases_id}" alt="Needs Entry"></div>`

  purchases_card_template =
    `<div class="card" id="card-${new_purchases.purchases_id}" name="${new_purchases.purchases_id}" edit="0">
      <div class="card-header d-flex flex-row justify-content-between" id="card-header-${new_purchases.purchases_id}">
        <p id="purchase_order_${new_purchases.purchases_id}" name="purchase_order">${new_purchases.purchase_order}</p>
        <div class="d-flex justify-content-between" id="card-header-icons">
          ${alerted ? alerted_tag : ''}
          <div class="col">
            <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_purchases.purchases_id}" name="${new_purchases.purchases_id}" alt="Edit Entry">
          </div>
          <div class="col" style="padding-right: 0em;">
            <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_purchases.purchases_id}" name="${new_purchases.purchases_id}" alt="More Info">
          </div>
        </div>
      </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_purchases.purchases_id}">

      <div class="card_row">
        <p class="card-text" id="project_code_${new_purchases.purchases_id}" name="project_code">${new_purchases.project_code}</p>

        <p class="card-text" id="purchased_items_${new_purchases.purchases_id}" name="purchased_items">${new_purchases.purchased_items}</p>
        
        <p class="card-text value" id="invoice_amount_${new_purchases.purchases_id}" name="invoice_amount">${new_purchases.invoice_amount}</p>
      </div>

      <div class="card_row">
        <p class="card-text ${new_purchases.po_date_isNull ? 'missing_text' : ''}" id="po_date_${new_purchases.purchases_id}" id="po_date_${new_purchases.purchases_id}" name="po_date"><span class="text-muted">Purchase Order Date: </span>${new_purchases.po_date_isNull ? 'null' : new_purchases.po_date}</p>

        <p class="card-text ${new_purchases.supplier_name_isNull ? 'missing_text' : ''}" id="supplier_name_${new_purchases.purchases_id}" name="supplier_name"><span class="text-muted">Purchases From: </span>${new_purchases.supplier_name_isNull ? 'null' : new_purchases.supplier_name}</p>

      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_purchases.purchases_id}">

      <p class="card-text ${new_purchases.expected_date_isNull ? 'missing_text' : ''}" id="expected_date_${new_purchases.purchases_id}" name="expected_date"><span class="text-muted">Expected Payment Date: </span>${new_purchases.expected_date_isNull ? 'null' : new_purchases.expected_date}</p>

      <p class="card-text ${new_purchases.supplier_date_isNull ? 'missing_text' : ''}" id="supplier_date_${new_purchases.purchases_id}" name="supplier_date"><span class="text-muted">Supplier Delivary Date: </span>${new_purchases.supplier_date_isNull ? 'null' : new_purchases.supplier_date}</p>

    </div>
  </div>`

  return purchases_card_template;
}

// UI Functionality: Add Purchases Card
function addPurchases(new_purchases, prepend = false, replace=false) {
    // edge-case replace handler
  if (replace == true) {
    purchases_card_template = getTemplate(new_purchases)
    if( $(`form[id=edit-form-${new_purchases.purchases_id}]`).length > 0 )
    {
      $(`form[id=edit-form-${new_purchases.purchases_id}]`).replaceWith(purchases_card_template)
    }
    
    else{ $(`div[id=card-${new_purchases.purchases_id}]`).replaceWith(purchases_card_template) }
    
    // Attaching Edit Handler to Replaced Card
    $(`img[id=card-edit-${new_purchases.purchases_id}]`).on("click", function () {
      $(this).empty
      id = $(this).attr("name")
      if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
      edit(cache, new_purchases.purchases_id)
    })
    
    // Dropdown for purchases Card Handler
    $(`img[id=card-dropdown-${new_purchases.purchases_id}]`).on("click", function () {
      id = $(this).attr("name")
  
      if ($(`#card-footer-${id}`).css('display') == "none") {
        $(`#card-footer-${id}`).show("fast")
      }
      else { $(`#card-footer-${id}`).hide("fast") }
    })
    
    document.getElementById(`card-${new_purchases.purchases_id}`).scrollIntoView({ behavior: "smooth", block: "start" })
    return;
  }

  if ($(`.card[name*='${new_purchases.purchases_id}']`).length > 0) {
    return
  }
  purchases_card_template = getTemplate(new_purchases)
  // Adding New Purchases Card to page
  if (prepend) { $('#purchases_display').prepend(purchases_card_template) }
  else { $('#purchases_display').append(purchases_card_template) }

  // Set new_purchases card css to display none
  $(`#card-footer-${new_purchases.purchases_id}`).css("display", "none")

  // Dropdown for purchases Card Handler
  dropdown_selector = "#card-dropdown-" + new_purchases.purchases_id
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).css('display') == "none") {
      $(`#card-footer-${id}`).show("fast")
    }
    else { $(`#card-footer-${id}`).hide("fast") }
  })

  // Edit button for purchases Card Handler
  edit_selector = "#card-edit-" + new_purchases.purchases_id
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    edit(cache, new_purchases.purchases_id)
  })

}

// UI Functionality: Remove all Purchases Cards
function removeAllPurchases() {
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#purchases_display").empty()
}

function removePurchases(purchases_id) {
  $(`div[id*='${purchases_id}']`).off() // unbinds handlers
  $(`div[id*='${purchases_id}']`).remove()
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
    if (property == "po_date") {
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
    else { new_purchases[property] = field.value }

  })

  postNewPurchases(new_purchases).then((response) => {
    response_purchase = response.new_purchases
    cache.append(response_purchase)
    addPurchases(response_purchase, prepend=true, replace=false)
    $("#modal-btn-close").trigger("click")
  }).catch( (error) => {
    console.log(error)
    console.log(error.responseJSON)
    Object.keys(error.responseJSON).forEach(key => {
      title = propertyToTitle(String(key))
      error_text_template = `<div class="row text-left edit-validation-update-text" id=""><p class="error-text">${title}: ${error.responseJSON[key]}</p></div>`
      $("#modal-errors").prepend(error_text_template)
      $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
    })
  })
})
// ===== SEARCH FEAURE =====

// UX Functionality: Enter 'search mode' on enter key
$("#left_content_form").on("keypress", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 13) {// Enter Key
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
    cache.clearLibrary()
    searchPurchases(input_value).then((response) => {
      $("#input-search-clear").addClass("purchases_standard-btn-danger")
      if (response.length > 0) {
        for (const purchases of response) {
          $(".header_title").text(`Found ${response.length} results...`)
          purchases["searched"] = true
          cache.append(purchases)
          addPurchases(purchases)
        }
      }
      else { $(".header_title").text(`No results for ${input_value}`) }
    }).catch( (error) => {
      $(`purchases_display`).append(`<p class="h5 text-danger> Server Search Query Error: Please report bug with the text: ${error} </p>`)
    })
  }
})

// UX Functionality: Leave 'search mode' on clear button press
$("#input-search-clear").click(function () {
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
function enterSearch() {
  search_mode = true
  removeAllPurchases()
  return true
}

// Leave Search
function leaveSearch() {
  if ($("#input-search-clear").hasClass("purchases_standard-btn-danger")) { $("#input-search-clear").removeClass("purchases_standard-btn-danger") }
  $("#input-search").val("")
  search_mode = false
  removeAllPurchases()
  start(cache)
}

// ===== FILTERING TOGGLES =====

// Reverse List Button
$("#reverse-list").click(function () {
  $("#purchases_display").children().each(function () {
    $("#purchases_display").prepend($(this))
  })
})

// ===== EDIT FEATURE ======

// enter editMode
function edit(library, purchases_id) {
  edit_check = $(`.card[name=${purchases_id}]`).attr("edit")

  if (edit_check == "0") {
    $(`.card[name=${purchases_id}]`).attr("edit", "1") // set active card to edit mode
    $(`#card-${purchases_id}`).wrap(`<form id="edit-form-${purchases_id}"></form`)
    $(`#card-body-${purchases_id}`).removeClass(["d-flex", "justify-content-between"])
    $(`#card-footer-${purchases_id}`).css("display", "block")
    $(`#card-dropdown-${purchases_id}`).parent().hide()


    $(`p[id*=${purchases_id}]`).each(function () {
      field = $(this).attr("name") ? $(this).attr("name") : ''
      dom_value = $(this).text() ? $(this).text() : ''
      input_field_template = ``
      
      // Configuring Input DOM based on field
      if (field == "purchase_order") {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${purchases_id}">
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${purchases_id}" name="${field}">
        </div>`
      }
      else if (field == "invoice_amount") {
        invoice_currency = dom_value.substr(0, 1)
        input_field_template = `
        <div class="mb-3 form-group" id="currency_${purchases_id}">
          <label for="edit_input_currency_${purchases_id}" class="sr-only form-label edit-label">Currency</label>
          <select class="form-select edit-input" id="edit_input_currency_${purchases_id}" name="currency">
          <option ${invoice_currency == 'R' ? 'selected ' : ''}value="MYR">RM</option>
          <option ${invoice_currency == '€' ? 'selected ' : ''}value="EUR">€</option>
          <option ${invoice_currency == '$' ? 'selected ' : ''}value="USD">$</option>
        </select>
        </div>
        <div class="mb-3 form-group" id="value_${purchases_id}">
          <label for="edit_input_value_${purchases_id}" class="form-label edit-label">Value</label>
          <input type="text" class="form-control edit-input" id="edit_input_value_${purchases_id}" name="value">
        </div>`
      } else {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${purchases_id}">
          <label for="edit_input_${field}_${purchases_id}" class="form-label edit-label ">${propertyToTitle(field)}</label>
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${purchases_id}" name="${field}">
        </div>`
      }
      console.log(field)
      $(this).replaceWith(input_field_template)
      if (field == "invoice_amount") {
        raw = dom_value
        matches = raw.match(/\d+/g);
        if (matches.length == 1) { dom_value = matches[0] }
        else { dom_value = matches[0] + "." + matches[1] }
        
        // set .val() for value field
        $(`#edit_input_value_${purchases_id}`).val(dom_value)
      }
      else if(field == "po_date" || field == "supplier_date" || field == "expected_date" || field == "supplier_name")
      {
        console.log("in buffer if")
        buffer = 0
        if(field == "po_date") { buffer = 21 }
        else if ( field == "supplier_date" ) { buffer = 24 }
        else if ( field == "expected_date" ) { buffer = 23 }
        else if ( field == "supplier_name" ) { buffer = 16 }
        min = buffer;
        max = dom_value.length
        dom_value = dom_value.substr(min, max)
        $(`.edit-input[id*=${field}_${purchases_id}]`).val(dom_value)
      }
      else {
        $(`.edit-input[id*=${field}_${purchases_id}]`).val(dom_value)
      }
    })

    // Initliaze cancel & save changes buttons @card-footer
    card_footer_template = `
    <div class="card-footer d-flex justify-content-end" id="card_footer_${purchases_id}">
      <div class="my-3">
        <button type="button" class="btn btn-pair edit-button text-center" id="cancel-edit-${purchases_id}" name="${purchases_id}">Cancel</button>
        <button type="button" class="btn btn-pair edit-save text-center" id="save-edit-${purchases_id}" name="${purchases_id}" style="margin-right:0rem;">Save Changes</button>
      </div>
    </div>`

    edit_errors_template = `<div class="" id="edit-errors-${purchases_id}"></div>`

    // Add Footer Template with Cancel & Save buttons
    $(`.card[name=${purchases_id}]`).append(card_footer_template)
    // Add empty div to house form errors
    $(`#card-footer-${purchases_id}`).append(edit_errors_template)

    // Cancel Edit button handler
    $(`#cancel-edit-${purchases_id}`).on("click", function () {
      archive = library.getItem(purchases_id)
      addPurchases(archive, prepend=false, replace=true)
    })

    // Save Changes button handler
    $(`#save-edit-${purchases_id}`).on("click", function () {

      $(`#edit-errors-${purchases_id}`).empty()

      edit_purchases = {}

      // Get & Assign Data
      let data_form = $(`form[id=edit-form-${purchases_id}]`).serializeArray()
      $.each(data_form, function (i, field) {
        property = field.name
        edit_purchases[property] = field.value
      })
      edit_purchases["purchases_id"] = purchases_id

      // Make Ajax Call & handle OK response
      postEditPurchases(edit_purchases).then((response) => {
        new_edit = response.purchases
        library.updateItem(new_edit)
        addPurchases(new_edit, prepend=false, replace=true)
      }).catch((error) => {
        if (error.responseJSON) {
          Object.keys(error.responseJSON).forEach(key => {
            error_title = propertyToTitle(key)
            $(`#edit-errors-${edit_purchases.purchases_id}`).append(`<p class="error-text"> ${error_title}: ${error.responseJSON[key]}`)
            $(`.edit-input[name=${key}]`).addClass("input-error-highlight")
          })
        }
      })

    })

  }
  else {
    console.log("Already in edit mdoe")
  }
}
