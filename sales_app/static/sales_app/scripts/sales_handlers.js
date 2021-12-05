// UX Functionality: Start Up Sales  Page
function startUpSales() {
  sales_library.clearLibrary()
  $.when(getSales(sales_library)).done(function () {
    for (const sale of sales_library.getLibrary()) {
      UI_addSale(sale)
    }
  })
}

// UX Functionality: Add Sale Handler
$("#modal-btn-save").click(function () {

  new_sales = {}

  $("div[class*=modal-validation-update-text]").each(function () {
    $(this).remove()
  })

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addSale]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if (property == "order_date") {
      src = field.value
      src = src.replace("/", "-")
      src = src.replace("/", "-")
      src_split = src.split("-")
      src_split.reverse()
      temp = src_split[2]
      src_split[2] = src_split[1]
      src_split[1] = temp

      format_date = src_split.join("-")
      new_sales[property] = format_date
    }
    else if (property == "cancelled") {
      new_sales["cancelled"] = true
    }
    else {
      new_sales[property] = field.value

    }
  })

  // Calls Ajax postSale which will call UI_AddSale if server-side validation checks out
  postSale(new_sales)
})

// UI Functionality: Add Sale
function UI_addSale(new_sale) {

  sales_card_template =
    `<div class="card ${new_sale.cancelled ? 'cancelled-card' : ''}" id="sales-card-${new_sale.project_code}" name="${new_sale.project_code}">
    <div class="card-header ${new_sale.cancelled ? 'cancelled-card-header' : ''} d-flex flex-row justify-content-between" id="sales-card-header-${new_sale.project_code}">
      <p id="project_code_${new_sale.project_code}">${new_sale.project_code}</p>
      <div class="d-flex justify-content-between" style="width:4em">
        <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_sale.project_code}" name="${new_sale.project_code}" alt="Edit Entry">
        <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_sale.project_code}" name="${new_sale.project_code}" alt="More Info">
      </div>
    </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_sale.project_code}">
      <div class="card_row">
        <p class="card-text" id="project_name_${new_sale.project_code}">${new_sale.project_name}</p>
        <p class="card-text" id="client_name_${new_sale.project_code}">${new_sale.client_name}</p>
        <p class="card-text value" id="invoice_amount_${new_sale.project_code}">${new_sale.invoice_amount}</p>
        
      </div>
      <div class="card_row">
        <p class="card-text" id="order_date_${new_sale.project_code}"><span class="text-muted">Customer Order Date: </span>${new_sale.order_date}</p>
        <p class="card-text" id="shipping_date_${new_sale.project_code}"><span class="text-muted">Customer Wanted Date: </span>${new_sale.shipping_date}</p>
      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_sale.project_code}">
      <p class="card-text" id="project_detail_${new_sale.project_code}"><span class="text-muted">Project Detail: </span>${new_sale.project_detail}</p>
      <p class="card-text" id="payment_term_${new_sale.project_code}"><span class="text-muted">Payment Detail: </span>${new_sale.payment_term}</p>
    </div>
  </div>`

  // Prepend new_sale Card to DOM
  $('#sales_display').prepend(sales_card_template)

  // Dropdown for sales Card Handler
  dropdown_selector = "#card-dropdown-" + new_sale.project_code
  $(dropdown_selector).on("click", function () {
    id = $(this).attr("name")
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    else { $(`#card-footer-${id}`).hide("fast") }
  })

  // Edit button for sales Card Handler
  edit_selector = "#card-edit-" + new_sale.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    enterEditMode(new_sale.project_code)
  })
}

// UX Functionality: Handler for #reverse-list button
$("#reverse-list").click(function () {
  $("#sales_display").children().each(function () {
    $("#sales_display").prepend($(this))
  })
})

// UI Functionality: Selects a specific card to enterEditMode, allowing for inputs and POST to db
function enterEditMode(project_code) {
  edit_check = $(`#sales-card-${project_code}`).attr('editing');

  if (edit_check == undefined || edit_check == "0") {

    if (!$(`#sales-card-${project_code}`).attr("editing") || $(`#sales-card-${project_code}`).attr("editing", "0")) {

      // Set sales-card (wrapper) attribute 'editing' to active '1'
      $(`#sales-card-${project_code}`).attr("editing", "1")

      // Edit Card Styling for Editing formatting
      $(`#sales-card-${project_code}`).wrap(`<form id="edit-form-${project_code}"></form`)
      $(`#card-body-${project_code}`).removeClass("justify-content-between")
      $(`#card-body-${project_code}`).removeClass("d-flex")

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
      invoice_value = (invoice_currency == "R") ? invoice_amount.substr(2, invoice_amount.length) : invoice_amount.substr(1, invoice_amount.length)

      // Format extracted invoice_currency invoice_value into DOM elements
      currency_value_input = `<div class="form-group my-2" id="form-group-currency_${project_code}">
      <label for="input_currency" class="sr-only ps-1 pb-2" style="color: #426285">Currency</label>
      <select class="form-select edit-input" id="input_currency_${project_code}" name="currency" required>
        <option ${invoice_currency == 'RM' ? 'selected ' : ''}value="MYR">RM</option>
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

      // Format and Append Cancelled Input
      sale_cancelled = ($(`#sales-card-${project_code}`).hasClass('cancelled-card')) ? true : false
      const cancelled_input = `<input class="form-check-input edit-input edit-check-input my-2" style="margin-right: 1em" type="checkbox" value="" id="input_cancelled_${project_code}" name="cancelled" ${sale_cancelled ? 'checked' : ''}>`

      // Add new cancelled DOM elements to card-footer
      $(`#card-footer-${project_code}`).append(cancelled_input)
      $(`#input_cancelled_${project_code}`).wrap(`<div class="form-group mb-2 d-flex align-items-center" id="form-group-cancelled_${project_code}"></div>`)

      $(`#form-group-cancelled_${project_code}`).append(`<label class="form-check-label pt-1" for="input_cancelled_${project_code}" style="color: #426285;font-size:1.15em"> Cancelled Order? </label>`)

      // Add Cancel and Save Changes Buttons
      $(`#sales-card-${project_code}`).append(`<div class="d-flex flex-row justify-content-end m-3 sales_footer_buttons" id="card-footer-buttons-${project_code}">
      <button type="button" class="btn sales_standard-btn" id="cancel-edit-${project_code}" name="${project_code}" style="width:auto;">Cancel</button>
      <button class="btn sales_secondary-btn" style="margin-left: 0.75em;width:auto;" name="${project_code}" id="save-edit-${project_code}">Save changes</button></div>`)

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
        if ($(`#sales-card-${id}`).attr("editing") == "1") {
          console.log("calling getSale for some reason")
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
          else {
            sale[property] = field.value
          }
        })

        console.log(sale)
        if ($(`#sales-card-${id}`).attr("editing") == "1") {
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

  // Revert DOM and Styling to before Edit mode
  $(`#sales-card-${project_code}`).unwrap()
  $(`#card-body-${project_code}`).addClass("justify-content-between")
  $(`#card-body-${project_code}`).addClass("d-flex")
  $("div[class*=edit-validation-update-text]").each(function () {
    $(this).remove()
  })

  if (is_cancelled) {
    $(`#sales-card-${project_code}`).addClass('cancelled-card')
    $(`#sales-card-header-${project_code}`).addClass('cancelled-card-header')
  }
  if (!is_cancelled && $(`#sales-card-${project_code}`).hasClass('cancelled-card')) {
    $(`#sales-card-${project_code}`).removeClass('cancelled-card')
    $(`#sales-card-header-${project_code}`).removeClass('cancelled-card-header')
  }

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
  // Finally, set sales-card editing to false "0" and scroll into view 
  $(`#sales-card-${sale.project_code}`).attr("editing", 0)
  document.getElementById(`sales-card-${sale.project_code}`).scrollIntoView(false)

  // Edit button for sales Card Handler
  $(`#card-edit-${project_code}`).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    enterEditMode(project_code)
  })
}

// UI Functionality: Entering search mode clears all displayed cards
function enterSearchMode() {
  search_mode = true
  UI_removeAll()
  return true
}

// UI Functionality: Leaving search mode displays all previously hidden cards
function leaveSearchMode() {
  search_mode = false

  UI_removeAll()
  startUpSales()
  // clearSearchDOM()
  $("#input-search").val("")

}

// UX Functionality: Enter 'search mode' on enter key
$("#left_content_form").on("keypress", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 13) {
    event.preventDefault();

    if (!search_mode) { // check if already in search mode, if false then enter and start search
      enterSearchMode()
    }
    else {
      UI_removeAll()
    }
    const input_value = $("#input-search").val()
    searchSales(input_value)
    $("#sales_display").append(`<div class="text-center" id="search-text"><h5>Searching for ${input_value}...</h5></div>`)
    return false;
  }
})

// UX Functionality: Leave 'search mode' on escape key
$("#left_content_form").on("keyup", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 27) {
    if (search_mode) { leaveSearchMode() } // check if already out of search mode
  }
})

// UX Functionality: calls leaveSearchMode
$("#input-search-clear").click(function () {
  if (search_mode) { leaveSearchMode() } // Prevents clearing override if clicked whilst not in search_mode
})

// UX Functionality: Show Cancelled Order Toggle
$("#input-cancelled").click(function () {
  if (!$(this).is(":checked")) {
    $("div[class*=cancelled-card]").each(function () {
      $(this).remove()
    })
    return
  }
  for (const sale of sales_library.getLibrary()) {
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

// UI Functionality: Removes Sale cards from #sales_display
function UI_removeSale(sale_id) {
  $(`div[id*='${sales_id}']`).off() // unbinds handlers ?
  $(`div[id*='${sales_id}']`).remove()
}

// UI Functionality: Removes All Sale cards from #sales_display
function UI_removeAll() {
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#sales_display").empty()
}

function propertyToTitle(property) {
  if (property === "shipping_date") //edge-case
  {
    return "Customer Wanted Date"
  }
  src = property.split("_")
  title = null
  for (i = 0; i < src.length; i++) {
    src[i] = src[i].charAt(0).toUpperCase() + src[i].substr(1, src[i].length)
  }
  title = src.join(" ")

  return title
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
$('#modal-form-addSale input').keydown(function (e) {
  if (e.keyCode == 13) {
    var inputs = $(this).parents("form").eq(0).find(":input");
    if (inputs[inputs.index(this) + 1] != null) {
      inputs[inputs.index(this) + 1].focus();
    }
    e.preventDefault();
    return false;
  }
});