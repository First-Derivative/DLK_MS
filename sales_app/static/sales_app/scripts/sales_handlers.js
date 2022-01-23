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
  `<div class="card ${new_sales.cancelled ? 'cancelled-card' : ''} ${new_sales.completed ? 'completed-card' : ''}"  id="card-${new_sales.project_code}" name="${new_sales.project_code}">
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
        <p class="card-text ${ (new_sales.order_date_isNull) ? 'missing_text' : ''}" id="order_date_${new_sales.project_code}" name-"order_date"><span class="text-muted">Customer Order Date: </span>${ (new_sales.order_date_isNull) ? 'null' : new_sales.order_date}</p>
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
  // edge-case replace handler
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
    else if ( property == "order_date" )
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
  for (const sale of cache.getLibrary()) {
    if (sale.cancelled && search_mode) {
      if (sale.searched) {
        UI_addSale(sale)
      }
    }
    else if (sale.cancelled) {
      UI_addSale(sale)
    }
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
  for (const sale of cache.getLibrary()) {
    if (sale.completed && search_mode) {
      if (sale.searched) {
        UI_addSale(sale)
      }
    }
    else if (sale.completed) {
      UI_addSale(sale)
    }
  }
})

// ===== EDIT FEATURE ======

// edit Handler
function enterEditMode(project_code) {
  edit_check = $(`#card-${project_code}`).attr('editing');
  
  if (edit_check == undefined || edit_check == "0") {
    
    if (!$(`#card-${project_code}`).attr("editing") || $(`#card-${project_code}`).attr("editing", "0")) {
      
      // Set card (wrapper) attribute 'editing' to active '1'
      $(`#card-${project_code}`).attr("editing", "1")
      
      // Edit Card Styling for Editing formatting
      $(`#card-${project_code}`).wrap(`<form id="edit-form-${project_code}"></form`)
      $(`#card-body-${project_code}`).removeClass(["d-flex", "justify-content-between"])
      $(`#card-footer-${project_code}`).css("display", "block")
      
      // Replace p tags with inputs (Excludes Currency + Value)
      fields = ["project_code", "project_name", "client_name", "project_detail", "order_date", "shipping_date", "payment_term"]
      $.each(fields, function (i, item) {
        
        // handles project_code, project_name, client_name
        if (i < 3) {
          if ($(`#${item}_${project_code}`).parent().hasClass("card_row")) { $(`#${item}_${project_code}`).unwrap() }
          
          const input = $(`<input type="text" class="form-control edit-input" id="input_${item}_${project_code}" name="${item}" required>`).val($(`#${item}_${project_code}`).text())
          $(`#${item}_${project_code}`).replaceWith(input)

          $(`#input_${item}_${project_code}`).wrap(`<div class="form-group mb-2" ${i == 0 ? 'style="display: inline;' : ''} id="form-group-${item}_${project_code}"></div>`)

          $(`#form-group-${item}_${project_code}`).prepend(`<label for="input_${item}_${project_code}" class="sr-only ps-1 pb-2" id="label-${item}-${project_code}" style="color: #426285">${propertyToTitle(item)}</label>`)
        }

        // handles project_detail, order_date, shpping_date (customer wanted date), payment_term
        else {
          if ($(`#${item}_${project_code}`).parent().hasClass("card_row")) { $(`#${item}_${project_code}`).unwrap() }
          $(`#${item}_${project_code} > span`).remove()

          const input = (item == "project_detail") ? $(`<textarea class="form-control" id="input_${item}_${project_code}" name="${item}" style="height: 6em" required>></textarea>`).val($(`#${item}_${project_code}`).text()) : $(`<input type="text" class="form-control edit-input" id="input_${item}_${project_code}" name="${item}" required>`).val($(`#${item}_${project_code}`).text())
          $(`#${item}_${project_code}`).replaceWith(input)

          $(`#input_${item}_${project_code}`).wrap(`<div class="form-group my-2" id="form-group-${item}_${project_code}"></div>`)
          $(`#form-group-${item}_${project_code}`).prepend(`<label for="input_${item}_${project_code}" class="sr-only ps-1 pb-2" style="color: #426285">${i == 5 ? "Customer Wanted Date" : propertyToTitle(item)}</label>`)
        }
      })

      // Add Currency + Value Input
      invoice_amount = $(`#invoice_amount_${project_code}`).text()
      invoice_currency = invoice_amount.substr(0, 1)
      invoice_value = invoice_amount.replace(/[^\d.-]/g, '')

      // Format extracted invoice_currency invoice_value into DOM elements
      currency_value_input = `<div class="form-group my-2" id="form-group-currency_${project_code}">
      <label for="input_currency" class="sr-only ps-1 pb-2" style="color: #426285">Currency</label>
      <select class="form-select edit-input" id="input_currency_${project_code}" name="currency" required>
        <option ${invoice_currency == 'R' ? 'selected ' : ''}value="MYR">RM</option>
        <option ${invoice_currency == '€' ? 'selected ' : ''}value="EUR">€</option>
        <option ${invoice_currency == '$' ? 'selected ' : ''}value="USD">$</option>
      </select></div>
      <div class="form-group mb-2" id="form-group-value_${project_code}">
        <label for="input_value" class="sr-only ps-1 pb-2" style="color: #426285">Amount</label>
        <input type="text" class="form-control edit-input" id="input_value_${project_code}" name="value">
      </div>`
      // Replace invoice amount with inputs
      $(`#invoice_amount_${project_code}`).replaceWith(currency_value_input)
      $(`#input_value_${project_code}`).val(invoice_value)

      // Format and Append Cancelled & Completed Input
      sale_cancelled = ($(`#card-${project_code}`).hasClass('cancelled-card')) ? true : false
      const cancelled_input = `<input class="form-check-input edit-input edit-check-input my-2" style="margin-right: 1em" type="checkbox" value="" id="input_cancelled_${project_code}" name="cancelled" ${sale_cancelled ? 'checked' : ''}>`
      sale_completed = ($(`#card-${project_code}`).hasClass('completed-card')) ? true : false
      const completed_input = `<input class="form-check-input edit-input edit-check-input my-2" style="margin-right: 1em" type="checkbox" value="" id="input_completed_${project_code}" name="completed" ${sale_completed ? 'checked' : ''}>`

      // Add new Cancelled & Completed DOM elements to card-footer
      $(`#cancelled_${project_code}`).replaceWith(cancelled_input)
      $(`#completed_${project_code}`).replaceWith(completed_input)

      $(`#input_cancelled_${project_code}`).wrap(`<div class="form-group mb-2 d-flex align-items-center" id="form-group-cancelled_${project_code}"></div>`)
      $(`#input_completed_${project_code}`).wrap(`<div class="form-group mb-2 d-flex align-items-center" id="form-group-completed_${project_code}"></div>`)

      $(`#form-group-cancelled_${project_code}`).append(`<label class="form-check-label pt-1" for="input_cancelled_${project_code}" style="color: #426285;font-size:1.15em"> Cancelled Order? </label>`)
      $(`#form-group-completed_${project_code}`).append(`<label class="form-check-label pt-1" for="input_completed_${project_code}" style="color: #426285;font-size:1.15em"> Completed Order? </label>`)

      // Add Cancel and Save Changes Buttons
      $(`#card-${project_code}`).append(`<div class="d-flex flex-row justify-content-end m-3 sales_footer_buttons" id="card-footer-buttons-${project_code}">
      <button type="button" class="btn std-btn" id="cancel-edit-${project_code}" name="${project_code}" style="width:auto;">Cancel</button>
      <button class="btn std-btn" style="margin-left: 0.75em;width:auto;" name="${project_code}" id="save-edit-${project_code}">Save changes</button></div>`)

      // Add Event Handlers to newly appended DOMS
      $('.edit-input').on("keydown", function (e) {
        if (e.keyCode == 13) {
          var inputs = $(this).parents("form").eq(0).find(":input");
          if (inputs[inputs.index(this) + 1] != null) {
            inputs[inputs.index(this) + 1].focus();
          }
          e.preventDefault();
          return false;
        }
      })

      // Cancel_edit button for sales editing handler
      $(`#cancel-edit-${project_code}`).on("click", function () {
        id = $(this).attr("name")
        if ($(`#card-${id}`).attr("editing") == "1") {
          getSale({ "project_code": String(project_code) }, leaveEditMode)
        }
      })

      // Save Edit button for sales editing handler
      $(`#save-edit-${project_code}`).on("click", function (e) {
        // init
        e.preventDefault();
        id = $(this).attr("name")
        $(`div[id*=error-text-${id}]`).each(function () {
          $(this).remove()
        })

        // Gathering & Formatting Data
        sale = {}
        sale["cancelled"] = false
        sale["completed"] = false

        // Get & Assign Data
        let data_form = $(`form[id=edit-form-${project_code}]`).serializeArray()
        $.each(data_form, function (i, field) {
          property = field.name
          // if (property == "order_date") {
          //   src = field.value
          //   src = src.replace("/", "-")
          //   src = src.replace("/", "-")
          //   src_split = src.split("-")
          //   src_split.reverse()
          //   temp = src_split[2]
          //   src_split[2] = src_split[1]
          //   src_split[1] = temp

          //   format_date = src_split.join("-")
          //   sale[property] = format_date
          // }
          if (property == "cancelled") {
            sale["cancelled"] = true
          }
          else if (property == "completed") {
            sale["completed"] = true
          }
          else {
            sale[property] = field.value
          }
        })

        if ($(`#card-${id}`).attr("editing") == "1") {
          editSale(sale, leaveEditMode)
        }
      })

      // Autoresize by Jack Moore
      autosize($(`#input_project_detail_${project_code}`))
      $(`#input_project_detail_${project_code}`).css("height", "5em")
    }
  }
}

function leaveEditMode(sale) {
  project_code = sale.project_code
  is_cancelled = sale.cancelled
  is_completed = sale.completed

  // Reset card & card-header classes
  $(`#card-${project_code}`).removeClass()
  $(`#card-header-${project_code}`).removeClass()

  // Revert DOM and Styling to before Edit mode
  $(`#card-${project_code}`).unwrap()
  $(`#card-${project_code}`).addClass("card")
  $(`#card-header-${project_code}`).addClass(["card-header", "d-flex", "flex-row", "justify-content-between"])
  $(`#card-body-${project_code}`).addClass(["d-flex", "justify-content-between"])
  $(`#card-footer-${project_code}`).css("display", "flex")

  if (is_cancelled) {
    $(`#card-${project_code}`).addClass("cancelled-card")
    $(`#card-header-${project_code}`).addClass("cancelled-card-header")
  }

  if (is_completed) {
    $(`#card-${project_code}`).addClass("completed-card")
    $(`#card-header-${project_code}`).addClass("completed-card-header")
  }

  // Remove excess validation texts
  $("div[class*=edit-validation-update-text]").each(function () {
    $(this).remove()
  })

  // Empty card-body, card-footer card-footer-buttons, 
  $(`#card-body-${project_code}`).empty();
  $(`#card-footer-${project_code}`).empty();
  $(`#card-footer-buttons-${project_code}`).remove();

  // Add card_rows to card-body
  $(`#card-body-${project_code}`).append(`<div class="card_row" name="${project_code}_row0"></div>`)
  $(`#card-body-${project_code}`).append(`<div class="card_row" name="${project_code}_row1"></div>`)

  $.each(sale, function (field, value) {
    if (field == "project_code") {
      selector = `#input_project_code_${project_code}`
      $(selector).unwrap()
      $(selector).replaceWith(`<p id="project_code_${project_code}">${project_code}</p>`)
    }
    else if (field == "project_name" || field == "client_name") {
      $(`.card_row[name=${project_code}_row0]`).append(`<p class="card-text" id="${field}_${project_code}">${value}</p>`)
    }
    else if (field == "invoice_amount") {
      $(`.card_row[name=${project_code}_row0]`).append(`<p class="card-text value" id="invoice_amount_${project_code}">${value}</p>`)
    }
    else if (field == "order_date" || field == "shipping_date") {
      $(`.card_row[name=${project_code}_row1]`).append(`<p class="card-text" id="${field}_${project_code}"><span class="text-muted">${propertyToTitle(field)}: </span>${value}</p>`)
    }
    else if (field == "project_detail" || field == "payment_term") {
      $(`#card-footer-${project_code}`).append(`<p class="card-text" id="${field}_${project_code}"><span class="text-muted">${propertyToTitle(field)}: </span>${value}</p>`)
    }
  })
  // Append Cancelled & Completed at the end
  $(`#card-footer-${project_code}`).append(`<p class="card-text" id="cancelled_${project_code}"><span class="text-muted">Cancelled: </span>${is_cancelled ? 'True' : 'False'}</p>`)
  $(`#card-footer-${project_code}`).append(`<p class="card-text" id="completed_${project_code}"><span class="text-muted">Completed: </span>${is_completed ? 'True' : 'False'}</p>`)

  // Finally, set card editing to false "0" and scroll into view 
  $(`#card-${sale.project_code}`).attr("editing", 0)
  document.getElementById(`card-${sale.project_code}`).scrollIntoView(false)

  // Edit button for sales Card Handler
  $(`#card-edit-${project_code}`).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    enterEditMode(project_code)
  })
}