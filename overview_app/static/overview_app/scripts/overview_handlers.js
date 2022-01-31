// ===== AUXILIARY FUNCTIONS =====

function propertyToTitle(property) {
  format = property.split("_")
  for (i = 0; i < format.length; i++) {
    format[i] = format[i].charAt(0).toUpperCase() + format[i].substr(1, format[i].length)
  }
  return format.join(" ")
}

function start(src) {
  display_selector = `#` + src + `_display`
  getAllRecords(getAll_url).then((response) => {
    data = response.data
    count = data.length
    for (i = 0; i < count; i++) {
      content = data.pop()
      addElement(content, src)

      if (i == count - 5) {
        removeLoadingBar()
      }
    }
  }).catch(error => {

    $(display_selector).append(`<p class="h5 text-danger> Get Records Error: Please report bug with the text: ${error} </p>`)
  })
}

function addLoadingBar(src) {
  display_selector = `#` + src + `_display`
  if (src == "accounts") {
    $("#main_display").prepend(`<div class="h5 bg-warning p-3" id="loading_bar"> Loading items from Database... </div>`)
  } else {
    $(display_selector).prepend(`<div class="h5 bg-warning p-3" id="loading_bar"> Loading items from Database... </div>`)
  }
}

function removeLoadingBar() {
  if ($("#loading_bar").length > 0) {
    $("#loading_bar").fadeOut("fast", function () {
      $(this).remove()
    })
  }
}

function formatDate(input) {
  const format = input.match(/([\d]{4})-(0?[\d]{2})-(0?[\d]{2})/g)
  console.log(format)
  if (format != null) {
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

// ===== UI ADD/REMOVE =====

// Add Element to src_display given record
function addElement(record, src, prepend = false, replace = false) {
  id = null
  if (src == "accounts") { id = record.paymentstatus_id }
  else {
    id = record[`${src}_id`]
  }

  // edge-case: Replace handler
  if (replace == true) {
    template = getTemplate(record)

    if (src == "accounts") {
      $(`tr[name=${record.id}]`).replaceWith(template)
      // Set Link to sales via project_code
      if ($(`th[name=sales_project_code]`).length > 0) {
        $(`th[name=sales_project_code]`).on("click", function () {
          sales_id = $(this).text()
          url = $("#sales-nav-link").attr("href") + "?search=" + sales_id
          window.location.replace(url);
          return;
        })
      }
      return
    } else {
      if ($(`form[id=edit-form-${record.id}]`).length > 0) {
        $(`form[id=edit-form-${record.id}]`).replaceWith(template)
      }
      else { $(`div[id=card-${record.id}]`).replaceWith(template); }
    }

    // Dropdown handler for record cards
    dropdown_selector = "#card-dropdown-" + record.id
    if ($(dropdown_selector).length > 0) {
      $(dropdown_selector).on("click", function () {
        dropdown_id = $(this).attr("name")

        if ($(`#card-footer-${dropdown_id}`).css('display') == "none") {
          $(`#card-footer-${dropdown_id}`).show("fast")
        }
        else { $(`#card-footer-${dropdown_id}`).hide("fast") }
      })
    }

    // Edit button handler for record cards
    edit_selector = "#card-edit-" + record.id
    if ($(edit_selector).length > 0) {
      $(edit_selector).on("click", function () {
        edit_id = $(this).attr("name")
        if ($(`#card-footer-${edit_id}`).css('display') == "none") { $(`#card-footer-${edit_id}`).show("fast") }
        // editElement(record.id, src)
      })
    }

    if (src == "accounts") {
      document.getElementById(`card-${record.id}`).scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      document.getElementById(`tr-${record.id}`).scrollIntoView({ behavior: "smooth", block: "start" })
    }
    return;
  }

  // Check for Duplicates
  if (src == "accounts") { //temp check whilst accounts is table interface
    if ($(`.tr[name=${record.id}]`).length > 0) { return; }
  } else {
    if ($(`.card[name*='${record.id}']`).length > 0) { return; }
  }

  template = null
  if (src == "accounts") {
    template = getTableTemplate(record)
  } else {
    template = getTemplate(record)
  }

  // Add Element from template to src_display
  if (prepend) { $(`#{src}_display`).prepend(template) }
  else { $(`#${src}_display`).append(template) }

  // Set card-footers to display none
  if ($(`#card-footer-${record.id}`).length > 0) {
    $(`#card-footer-${record.id}`).css("display", "none")
  }

  // Set Link to sales via project_code
  if ($(`th[name=sales_project_code]`).length > 0) {
    $(`th[name=sales_project_code]`).on("click", function () {
      sales_id = $(this).text()
      url = $("#sales-nav-link").attr("href") + "?search=" + sales_id
      window.location.replace(url);
      return;
    })
  }

  // Dropdown handler for record cards
  dropdown_selector = "#card-dropdown-" + record.id
  if ($(dropdown_selector).length > 0) {
    $(dropdown_selector).on("click", function () {
      dropdown_id = $(this).attr("name")

      if ($(`#card-footer-${dropdown_id}`).css('display') == "none") {
        $(`#card-footer-${dropdown_id}`).show("fast")
      }
      else { $(`#card-footer-${dropdown_id}`).hide("fast") }
    })
  }

  // Edit button handler for record cards
  edit_selector = "#card-edit-" + record.id
  if ($(edit_selector).length > 0) {
    $(edit_selector).on("click", function () {
      edit_id = $(this).attr("name")
      if ($(`#card-footer-${edit_id}`).css('display') == "none") { $(`#card-footer-${edit_id}`).show("fast") }
      // editElement(record.id, src)
    })
  }

}

// Remove all Records Cards
function removeAllElements(src) {
  display_selector = `#` + src + `_display`
  if (src == "accounts") {
    $(`.tr`).each(function () {
      $(this).off()
    })
  } else {
    $(`.card`).each(function () {
      $(this).off()
    })
  }
  $(display_selector).empty()
}

// ===== REPORT FEATURE =====

$(`#reportModal-save`).click(function () {
  report = {}

  // Get & Assign Data
  let data_form = $(`#modal-form-report`).serializeArray()
  $(`form[id=report_form]`)
  $.each(data_form, function (i, field) {
    property = field.name
    report[property] = field.value
  })
  report["location"] = window.location.href
  // Make Ajax Call & handle OK response
  postReport(report).then((response) => {
    $(`#report-output`).empty()
    $(`#report-output`).append(`<p class="text-success"> Report recorded! Thank you <p>`)
  }).catch((error) => {
    if (error.responseJSON) {
      Object.keys(error.responseJSON).forEach(key => {
        error_title = propertyToTitle(key)
        $(`#report-output`).append(`<div class="row"> <p class="error-text"> ${error_title}: ${error.responseJSON[key]}</p> </div>`)
        $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
      })
    }
  })
})

// TABLE FEATURES

function getTableTemplate(record) {
  const template = `
    <tr class="payment ${(record.cancelled) ? 'cancelled-payment ' : ''}${record.completed ? 'completed-payment' : ''}" id="tr-${record.paymentstatus_id}" name='${record.paymentstatus_id}'>
      <th scope="row" class="hoverable" id="${record.paymentstatus_id}" name="sales_project_code"> ${record.sales_project_code} </th>
        <td id="${record.paymentstatus_id}" name="sales_invoice_amount"> ${record.sales_invoice_amount} </td>
        <td id="${record.paymentstatus_id}" name="invoice_number" class="${record.invoice_number_isNull ? 'missing_text' : ''}"> ${record.invoice_number} </td>
        <td id="${record.paymentstatus_id}" name="invoice_date" class="${record.invoice_date_isNull ? 'missing_text' : ''}"> ${record.invoice_date} </td>
        <td id="${record.paymentstatus_id}" name="status" class="${record.status_isNull ? 'missing_text' : ''}"> ${record.status} </td>
        <td id="${record.paymentstatus_id}" name="completed" class="text-center" value="${record.completed ? 'true' : 'false'}"> ${record.completed ? `<img src="${true_icon_src}", width="24", height="24">` : `<img src="${false_icon_src}", width="24", height="24">`}</td>
        <td id="${record.paymentstatus_id}" name="cancelled" class="text-center" value="${record.cancelled ? 'true' : 'false'}"> ${record.cancelled ? `<img src="${true_icon_src}", width="24", height="24">` : `<img src="${false_icon_src}", width="24", height="24">`}</td>
    </tr>`

  return template
}

// ===== ADD ENTRY FEATURE =====

$("#modal-btn-save").click(function () {
  src = $(this).attr("source")
  record = {}

  $("input[class*=input-error-highlight]").each(function () {
    $(this).removeClass("input-error-highlight")
  })

  $("#modal-errors").empty()

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addRecord]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if (property == "cancelled") {
      record["cancelled"] = true
    }
    else if (property == "completed") {
      record["completed"] = true
    }
    else if (property == "order_date" || property == "po_date") {
      record[property] = formatDate(field.value)
    }
    else {
      record[property] = field.value
    }
  })
  console.log(record)
  postNewRecords(postNew_url, record).then((response) => {
    response_record = response.data
    addElement(record, src, prepend = true, replace = false)
    $("#modal-btn-close").trigger("click")
  }).catch((error) => {
    if (error.responseJSON) {
      Object.keys(error.responseJSON).forEach(key => {
        title = propertyToTitle(String(key))
        error_text_template = `<div class="row text-left edit-validation-update-text" id=""><p class="error-text">${title}: ${error.responseJSON[key]}</p></div>`
        $("#modal-errors").prepend(error_text_template)
        $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
      })
    } else {
      error_text_template = `<div class="row text-left edit-validation-update-text" id=""><p class="error-text">${error.responseText}</p></div>`
      $("#modal-errors").prepend(error_text_template)
    }
  })
})

// FILTERING & TOGGLES

$("#reverse-list").click(function () {
  src = $(this).attr("source")
  display_selector = `#` + src + `_display`
  $(display_selector).children().each(function () {
    $(display_selector).prepend($(this))
  })
})

// ===== SEARCH FEAURE =====

// UX Functionality: Enter 'search mode' on enter key
$("#left_content_form").on("keypress", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 13) {// Enter Key
    event.preventDefault();
    src = $(this).attr("source")
    display_selector = `#` + src + `_display`
    const input_value = $("#input-search").val()

    if (input_value == "") { return; }

    const search_header_template = `
    <div class="row" id="searchHeader">
    <div class="header_title"> Searching For ${input_value}
    </div>
    </div>
    `
    // Clear page for search results
    if ($("#searchHeader").length > 0) { $("#searchHeader").remove() }
    removeAllElements(src)
    removeLoadingBar()

    // Adding New Search Header
    if (src == "accounts") {
      $("#main_display").prepend(search_header_template)
    } else {
      $(display_selector).prepend(search_header_template)
    }

    searchRecords(search_url, input_value).then((response) => {
      $("#input-search-clear").addClass("std-btn-red")
      if (response.length > 0) {
        for (const record of response) {
          $(".header_title").text(`Found ${response.length} results...`)
          addElement(record, src)
        }
      }
      else { $(".header_title").text(`No results for ${input_value}`) }
    }).catch((error) => {

      error_template = `<p class="h5 text-danger> Server Search Query Error: Please report bug with the text: ${error} </p>`

      if (src == "accounts") {
        $("#main_display").append(error_template)
      } else {
        $(display_selector).append(error_template)
      }
    })

  }
})

// UX Functionality: Leave 'search mode' on clear button press
$("#input-search-clear").click(function () {
  if ($("#searchHeader").length == 0) { console.log("caught "); return; }

  src = $(this).attr("source")
  leaveSearch(src)
})

// UX Functionality: Leave 'search mode' ALT Trigger:  escape key
$("#left_content_form").on("keyup", function (event) {
  keyPressed = event.keyCode || event.which;
  if (keyPressed === 27) {
    if ($("#searchHeader").length == 0) { console.log("caught "); console.log(); return; }

    src = $(this).attr("source")
    leaveSearch(src)
  }
})

// Leave Search
function leaveSearch(src) {

  // Clear
  if ($("#input-search-clear").hasClass("std-btn-red")) { $("#input-search-clear").removeClass("std-btn-red") }
  $("#input-search").val("")
  if ($("#searchHeader").length > 0) { $("#searchHeader").remove() }
  removeAllElements(src)
  removeLoadingBar()

  // Add
  addLoadingBar(src)
  start(src)
}