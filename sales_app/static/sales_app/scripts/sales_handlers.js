// ===== AUXILIARY FUNCTIONS =====
// Starts main function of webpage: getsAllSales & appends to #sales_display
function start(library) {
  library.clearLibrary()
  getAllSales().then((response) => {
    sales = response.sales
    sales_count = sales.length

    for (i = 0; i < sales_count; i++) {
      content = sales.pop()
      library.append(content)
      addSales(content)
    }
  }).catch((error) => {
    $(`sales_display`).append(`<p class="h5 text-danger> Get Sales Error: Please report bug with the text: ${error} </p>`)
  })
}

function propertyToTitle(property) {
  format = property.split("_")
  for (i = 0; i < format.length; i++) {
    format[i] = format[i].charAt(0).toUpperCase() + format[i].substr(1, format[i].length)
  }
  return format.join(" ")
}

function formatDate(input)
{
  const format = input.match(/([\d]{4})-(0?[\d]{2})-(0?[\d]{2})/g)
  console.log(format)
  if(format != null){
    console.log("in format")
    return input;
  }
  // Client: MM/DD/YYYY -> Server: YYYY-MM-DD
  raw = input
  raw = raw.replace("/", "-")
  raw = raw.replace("/", "-")
  raw_array = raw.split("-")

  raw_array.reverse()
  temp = raw_array[1]
  raw_array[1] = raw_array[2]
  raw_array[2] = temp

  return raw_array.join("-")
}

// UX Functionality: resolveCurrency for API serialized schema for Sales
function resolveCurrency(currency) {
  switch (currency) {
    case "MYR": return "RM";
    case "EUR": return "€";
    case "USD": return "$";
    default: return "ERROR";
  }
}

// UX Functionality: Prevents form (for modal inputs) submit on Enter; Replaces it with 'Tab'
$('#modal-form-addSales input').keydown(function (e) {
  if (e.keyCode == 13) {
    var inputs = $(this).parents("form").eq(0).find(":input");
    if (inputs[inputs.index(this) + 1] != null) {
      inputs[inputs.index(this) + 1].focus();
    }
    e.preventDefault();
    return false;
  }
});

// ===== UI ADD/REMOVE =====
function getTemplate(new_sales)
{
  alerted = false
  
  if (new_sales.project_detail_isNull || new_sales.order_date_isNull || new_sales.shipping_date_isNull || new_sales.payment_term_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-alert-${new_sales.project_code}" style="padding-bottom: 0.2em" name="${new_sales.project_code}" alt="Needs Entry"></div>`

  sales_card_template =
  `<div class="card ${new_sales.cancelled ? 'cancelled-card' : ''} ${new_sales.completed ? 'completed-card' : ''}"  id="card-${new_sales.project_code}" name="${new_sales.project_code}" edit="0">
    <div class="card-header ${new_sales.cancelled ? 'cancelled-card-header' : ''} ${new_sales.completed ? 'completed-card-header' : ''} d-flex flex-row justify-content-between" id="card-header-${new_sales.project_code}">
      <p id="project_code_${new_sales.project_code}" name="project_code">${new_sales.project_code}</p>
      <div class="d-flex justify-content-between" id="card-header-icons">
        ${alerted ? alerted_tag : ''}
        <div class="col">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_sales.project_code}" name="${new_sales.project_code}" alt="Edit Entry">
        </div>
        <div class="col" style="padding-right:0em;">
          <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_sales.project_code}" name="${new_sales.project_code}" alt="More Info">
        </div>
      </div>
    </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_sales.project_code}">
      <div class="card_row">
        <p class="card-text" id="project_name_${new_sales.project_code}" name="project_name">${new_sales.project_name}</p>
        <p class="card-text" id="client_name_${new_sales.project_code}" name="client_name">${new_sales.client_name}</p>
        <p class="card-text value" id="invoice_amount_${new_sales.project_code}" name="invoice_amount">${new_sales.invoice_amount}</p>
      </div>
      <div class="card_row">
        <p class="card-text ${ (new_sales.order_date_isNull) ? 'missing_text' : ''}" id="order_date_${new_sales.project_code}" name="order_date"><span class="text-muted">Customer Order Date: </span>${ (new_sales.order_date_isNull) ? 'null' : new_sales.order_date}</p>
        <p class="card-text ${ (new_sales.shipping_date_isNull) ? 'missing_text' : ''}" id="shipping_date_${new_sales.project_code}" name="shipping_date"><span class="text-muted">Customer Wanted Date: </span>${ (new_sales.shipping_date_isNull)  ? 'null' : new_sales.shipping_date}</p>
      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_sales.project_code}">
      <p class="card-text ${(new_sales.project_detail_isNull) ? 'missing_text' : ''}" id="project_detail_${new_sales.project_code}" name="project_detail"><span class="text-muted">Project Detail: </span>${ (new_sales.project_detail_isNull) ? 'null' : new_sales.project_detail}</p>
      <p class="card-text ${(new_sales.payment_term_isNull) ? 'missing_text' : ''}" id="payment_term_${new_sales.project_code}" name="payment_term"><span class="text-muted">Payment Detail: </span>${ (new_sales.payment_term_isNull) ? 'null' : new_sales.payment_term}</p>
      <p class="card-text" id="cancelled_${new_sales.project_code}" name="cancelled" value="${ (new_sales.cancelled) ? 'true' : 'false'}"><span class="text-muted">Cancelled: </span>${new_sales.cancelled ? 'True' : 'False'}</p>
      <p class="card-text" id="completed_${new_sales.project_code}" name="completed" value="${ (new_sales.completed) ? 'true' : 'false'}"><span class="text-muted">Completed: </span>${new_sales.completed ? 'True' : 'False'}</p>
    </div>
</div>`

    return sales_card_template;
}

// UI Functionality: Add Sale
function addSales(new_sales, prepend=false, replace=false) {
  // edge=case replace handler
  if (replace == true) {
    sales_card_template = getTemplate(new_sales)
    if( $(`form[id=edit-form-${new_sales.project_code}]`).length > 0 )
    {
      $(`form[id=edit-form-${new_sales.project_code}]`).replaceWith(sales_card_template)
    }
    
    else{ $(`div[id=card-${new_sales.project_code}]`).replaceWith(sales_card_template) }
    
    // Attatching Edit Handler to Replaced Card
    $(`img[id=card-edit-${new_sales.project_code}]`).on("click", function () {
      $(this).empty
      id = $(this).attr("name")
      if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
      edit(cache, new_sales.project_code)
    })
    
    // Dropdown for sales Card Handler
    $(`img[id=card-dropdown-${new_sales.project_code}]`).on("click", function () {
      id = $(this).attr("name")
  
      if ($(`#card-footer-${id}`).css('display') == "none") {
        $(`#card-footer-${id}`).show("fast")
      }
      else { $(`#card-footer-${id}`).hide("fast") }
    })
    
    document.getElementById(`card-${new_sales.project_code}`).scrollIntoView({ behavior: "smooth", block: "start" })
    return;
  }

  if ($(`.card[name*='${new_sales.project_code}']`).length > 0) {
    return
  }

  sales_card_template = getTemplate(new_sales)

  // Adding New Sales Card to page
  if (prepend) { $('#sales_display').prepend(sales_card_template) }
  else { $('#sales_display').append(sales_card_template) }

  // Set new_sales card css to display none
  $(`#card-footer-${new_sales.project_code}`).css("display", "none")

  // Dropdown for sales Card Handler
  dropdown_selector = "#card-dropdown-" + new_sales.project_code
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")

    if ($(`#card-footer-${id}`).css('display') == "none") {
      $(`#card-footer-${id}`).show("fast")
    }
    else { $(`#card-footer-${id}`).hide("fast") }
  })

  // Edit button for sales Card Handler
  edit_selector = "#card-edit-" + new_sales.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    edit(cache, new_sales.project_code)
  })
}

// UI Functionality: Removes all Sales Cards
function removeAllSales() {
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#sales_display").empty()
}

// UI Functionality: Removes singular Sales Card with project_code
function removeSales(project_code) {
  $(`div[id*='${project_code}']`).off() // unbinds handlers
  $(`div[id*='${project_code}']`).remove()
}

// ===== ADD ENTRY FEATURE =====

// UX Functionality: Add Sales Handler
$("#modal-btn-save").click(function () {
  new_sales = {}
  new_sales["cancelled"] = false
  new_sales["completed"] = false

  $("input[class*=input-error-highlight]").each(function () {
    $(this).removeClass("input-error-highlight")
  })

  $("#modal-errors").empty()

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addSales]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if (property == "cancelled") {
      new_sales["cancelled"] = true
    }
    else if (property == "completed") {
      new_sales["completed"] = true
    }
    else if (property == "order_date" )
    {
      new_sales[property] = formatDate(field.value)
    }
    else {
      new_sales[property] = field.value
    }
  })

  // Calls Ajax postNewSales which will call addSales if server-side validation checks out
  postNewSales(new_sales).then((response) => {
    response_sales = response.new_sales
    cache.append(response_sales)
    addSales(response_sales, prepend=true, replace=false)
    $("#modal-btn-close").trigger("click")
  }).catch( (error) => {
    Object.keys(error.responseJSON).forEach(key => {
      title = propertyToTitle(String(key))
      error_text_template = `<div class="row text-left edit-validation-update=text" id=""><p class="error-text">${title}: ${error.responseJSON[key]}</p></div>`
      $("#modal-errors").prepend(error_text_template)
      $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
    })
  })
})

// ===== SEARCH FEAURE =====

// UX Functionality: Enter 'search mode' on enter key
$("#left_content_form").on("keypress", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 13) {
    event.preventDefault();

    if (!search_mode) { // check if already in search mode, if false then enter and start search
      enterSearch()
    }
    else {
      removeAllSales()
    }
    const search_header_template = `
    <div class="row" id="searchHeader">
    <div class="header_title">
    </div>
    </div>
    `
    $("#sales_display").prepend(search_header_template)

    const input_value = $("#input-search").val()
    cache.clearLibrary()
    searchSales(input_value).then((response) => {
      $("#input-search-clear").addClass("std-btn-red")
      if (response.length > 0) {
        for (const sales of response) {
          $(".header_title").text(`Found ${response.length} results...`)
          sales["searched"] = true
          cache.append(sales)
          addSales(sales)
        }
      }
      else { $(".header_title").text(`No results for ${input_value}`) }
    }).catch( (error) => {
      $(`sales_display`).append(`<p class="h5 text-danger> Server Search Query Error: Please report bug with the text: ${error} </p>`)
    })
  }
})

// UX Functionality: Leave 'search mode' on escape key
$("#left_content_form").on("keyup", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 27) {
    if (search_mode) { leaveSearch() } // check if already out of search mode
  }
})

// UX Functionality: calls leaveSearch
$("#input-search-clear").click(function () {
  if (search_mode) { leaveSearch() } // Prevents clearing override if clicked whilst not in search_mode
})

// UI Functionality: Entering search mode clears all displayed cards
function enterSearch() {
  search_mode = true
  removeAllSales()
  return true
}

// UI Functionality: Leaving search mode displays all previously hidden cards
function leaveSearch() {
  search_mode = false
  if ($("#input-search-clear").hasClass("std-btn-red")) { $("#input-search-clear").removeClass("std-btn-red") }
  $("#input-search").val("")
  removeAllSales()
  start(cache)

}

// ===== FILTERING TOGGLES =====

$(`#page_down`).click(function () {
  window.scrollTo(0, document.body.scrollHeight);
})

$(`#page_up`).click(function () {
  window.scrollTo(document.body.scrollHeight, 0);
})

// UX Functionality: Handler for #reverse-list button
$("#reverse-list").click(function () {
  $("#sales_display").children().each(function () {
    $("#sales_display").prepend($(this))
  })
})

// UX Functionality: Show Cancelled Order Toggle
$("#input-cancelled").click(function () {
  if (!$(this).is(":checked")) {
    $("div[class*=cancelled-card]").each(function () {
      $(this).remove()
    })
    return
  }
  for (const sales of cache.allCancelled) {
    if (!search_mode) //not in search mode 
    {
      addSales(sales, prepend=true, replace=false)
    }
    else { if (sales.searched) { addSales(sales) } }
  }
})

// UX Functionality: Show Completed Order Toggle
$('#input-completed').click(function () {
  if (!$(this).is(":checked")) {
    $("div[class*=completed-card]").each(function () {
      $(this).remove()
    })
    return
  }
  for (const sales of cache.allCompleted) {
    if (!search_mode) //not in search mode 
    {
      addSales(sales, prepend=true, replace=false)
    }
    else { if (sales.searched) { addSales(sales) } }
  }
})

// ===== EDIT FEATURE ======

// edit Handler
// ===== EDIT FEATURE ======

// enter editMode
function edit(library, project_code) {
  edit_check = $(`.card[name=${project_code}]`).attr("edit")

  if (edit_check == "0") {
    $(`.card[name=${project_code}]`).attr("edit", "1") // set active card to edit mode
    $(`#card-${project_code}`).wrap(`<form id="edit-form-${project_code}"></form`)
    $(`#card-body-${project_code}`).removeClass(["d-flex", "justify-content-between"])
    $(`#card-footer-${project_code}`).css("display", "block")
    $(`#card-dropdown-${project_code}`).parent().hide()


    $(`p[id*=${project_code}]`).each(function () {
      field = $(this).attr("name") ? $(this).attr("name") : ''
      dom_value = $(this).text() ? $(this).text() : ''
      cancelled_value = undefined
      completed_value = undefined
      input_field_template = ``
      
      if(field == "cancelled") { cancelled_value = $(this).attr("value") }
      if(field == "completed") { completed_value = $(this).attr("value") }
      // Configuring Input DOM based on field
      if (field == "project_code") {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }
      else if (field == "invoice_amount") {
        invoice_currency = dom_value.substr(0, 1)
        input_field_template = `
        <div class="mb-3 form-group" id="currency_${project_code}">
          <label for="edit_input_currency_${project_code}" class="sr-only form-label edit-label">Currency</label>
          <select class="form-select edit-input" id="edit_input_currency_${project_code}" name="currency">
          <option ${invoice_currency == 'R' ? 'selected ' : ''}value="MYR">RM</option>
          <option ${invoice_currency == '€' ? 'selected ' : ''}value="EUR">€</option>
          <option ${invoice_currency == '$' ? 'selected ' : ''}value="USD">$</option>
        </select>
        </div>
        <div class="mb-3 form-group" id="value_${project_code}">
          <label for="edit_input_value_${project_code}" class="form-label edit-label">Value</label>
          <input type="text" class="form-control edit-input" id="edit_input_value_${project_code}" name="value">
        </div>`
      }
      else if (field == "cancelled" || field == "completed") {
        if(field == "cancelled")
        {
          input_field_template = `
          <div class="mb-3 form-group d-flex align-items-center" id="${field}_${project_code}">
            <input type="checkbox" class="form-check-input edit-check-input edit-input " id="edit_input_${field}_${project_code}" name="${field}" ${(cancelled_value == 'true') ? 'checked' : ''}>
            <label for="edit_input_${field}_${project_code}" class="form-label edit-label edit-label-checkbox" id="edit_label_${field}_${project_code}">${propertyToTitle(field)}</label>
          </div>`
        }
        else //completed
        {
          input_field_template = `
          <div class="mb-3 form-group d-flex align-items-center" id="${field}_${project_code}">
            <input type="checkbox" class="form-check-input edit-check-input edit-input " id="edit_input_${field}_${project_code}" name="${field}" ${(completed_value == 'true') ? 'checked' : ''}>
            <label for="edit_input_${field}_${project_code}" class="form-label edit-label edit-label-checkbox" id="edit_label_${field}_${project_code}">${propertyToTitle(field)}</label>
          </div>`
        }
      }
      else if ( field == "order_date")
      {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <label for="edit_input_${field}_${project_code}" class="form-label edit-label ">${propertyToTitle(field)}</label>
          <input type="text" class="form-control edit-input date" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      } 
      else {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <label for="edit_input_${field}_${project_code}" class="form-label edit-label ">${propertyToTitle(field)}</label>
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }

      $(this).replaceWith(input_field_template)

      if(field == "order_date") {
          // Attach Date Handler
          $('.date').datepicker({
            todayBtn: "linked",
            clearBtn: true,
            orientation: "top auto"
          });
      }

      if (field == "invoice_amount") {
        raw = dom_value
        matches = raw.match(/\d+/g);
        if (matches.length == 1) { dom_value = matches[0] }
        else { dom_value = matches[0] + "." + matches[1] }
        
        // set .val() for value field
        $(`#edit_input_value_${project_code}`).val(dom_value)
      }
      else if(field == "project_detail" || field == "shipping_date" || field == "order_date" || field == "payment_term")
      {
        buffer = 0
        if(field == "project_detail") { buffer = 16 }
        else if ( field == "shipping_date" ) { buffer = 22 }
        else if ( field == "order_date" ) { buffer = 21 }
        else if ( field == "payment_term" ) { buffer = 16 }
        min = buffer;
        max = dom_value.length
        dom_value = dom_value.substr(min, max)
        $(`.edit-input[id*=${field}_${project_code}]`).val(dom_value)
      } 
      else {
        $(`.edit-input[id*=${field}_${project_code}]`).val(dom_value)
      }
    })

    // Initliaze cancel & save changes buttons @card-footer
    card_footer_template = `
    <div class="card-footer d-flex justify-content-end" id="card_footer_${project_code}">
      <div class="my-3">
        <button type="button" class="btn btn-pair edit-button text-center" id="cancel-edit-${project_code}" name="${project_code}">Cancel</button>
        <button type="button" class="btn btn-pair edit-save text-center" id="save-edit-${project_code}" name="${project_code}" style="margin-right:0rem;">Save Changes</button>
      </div>
    </div>`

    edit_errors_template = `<div class="" id="edit-errors-${project_code}"></div>`

    // Add Footer Template with Cancel & Save buttons + Errors
    $(`.card[name=${project_code}]`).append(card_footer_template)
    $(`#card-footer-${project_code}`).append(edit_errors_template)

    // Cancel Edit button handler
    $(`#cancel-edit-${project_code}`).on("click", function () {
      archive = library.getItem(project_code)
      addSales(archive, prepend=false, replace=true)
    })

    // Save Changes button handler
    $(`#save-edit-${project_code}`).on("click", function () {

      $(`#edit-errors-${project_code}`).empty()

      edit_sales = {}

      // Get & Assign Data
      let data_form = $(`form[id=edit-form-${project_code}]`).serializeArray()
      $.each(data_form, function (i, field) {
        property = field.name
        
        if(property == "cancelled") 
        {
          edit_sales["cancelled"] = true
        } else if (property == "completed")
        {
          edit_sales["completed"] = true
        } else if (property == "order_date" )
        {
          edit_sales[property] = formatDate(field.value)
        }
        else{
          edit_sales[property] = field.value
        }
      })

      // Make Ajax Call & handle OK response
      postEditSales(edit_sales).then((response) => {
        new_edit = response.sales
        library.updateItem(new_edit)
        addSales(new_edit, prepend=false, replace=true)
      }).catch((error) => {
        if (error.responseJSON) {
          Object.keys(error.responseJSON).forEach(key => {
            error_title = propertyToTitle(key)
            $(`#edit-errors-${edit_sales.project_code}`).append(`<p class="error-text"> ${error_title}: ${error.responseJSON[key]}`)
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
