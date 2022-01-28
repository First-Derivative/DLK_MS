// ===== AUXILIARY FUNCTIONS =====

function propertyToTitle(property) {
  format = property.split("_")
  for (i = 0; i < format.length; i++) {
    format[i] = format[i].charAt(0).toUpperCase() + format[i].substr(1, format[i].length)
  }
  return format.join(" ")
}

function start(callback, src, params = null) {
  display_selector = `#` + src + `_display`
  if (params != null) {
    callback(params).then((response) => {
      data = response.data
      count = data.length
      for (i = 0; i < count; i++) {
        content = data.pop()
        addElement(content, src)

        if (i == count - 1) {
          if ($('#loading_info').length > 0) {
            $("#loading_info").fadeOut("fast", function () {
              $(this).remove()
            })
          }
        }
      }
    }).catch(error => {

      $(display_selector).append(`<p class="h5 text-danger> Get Records Error: Please report bug with the text: ${error} </p>`)
    })
  }
  else {
    callback().then((response) => {
      data = response.data
      count = data.length
      for (i = 0; i < count; i++) {
        content = data.pop()
        addElement(content, src)
      }
    }).catch(error => {
      selector = `# ` + src + `_display`
      $(selector).append(`<p class="h5 text-danger> Get Records Error: Please report bug with the text: ${error} </p>`)
    })
  }

}

// ===== UI ADD/REMOVE =====

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
      <th scope="row" id="${record.paymentstatus_id}" name="sales_project_code"> ${record.sales_project_code} </th>
        <td id="${record.paymentstatus_id}" name="sales_invoice_amount"> ${record.sales_invoice_amount} </td>
        <td id="${record.paymentstatus_id}" name="invoice_number" class="${record.invoice_number_isNull ? 'missing_text' : ''}"> ${record.invoice_number} </td>
        <td id="${record.paymentstatus_id}" name="invoice_date" class="${record.invoice_date_isNull ? 'missing_text' : ''}"> ${record.invoice_date} </td>
        <td id="${record.paymentstatus_id}" name="status" class="${record.status_isNull ? 'missing_text' : ''}"> ${record.status} </td>
        <td id="${record.paymentstatus_id}" name="completed" class="text-center" value="${record.completed ? 'true' : 'false'}"> ${record.completed ? `<img src="${true_icon_src}", width="24", height="24">` : `<img src="${false_icon_src}", width="24", height="24">`}</td>
        <td id="${record.paymentstatus_id}" name="cancelled" class="text-center" value="${record.cancelled ? 'true' : 'false'}"> ${record.cancelled ? `<img src="${true_icon_src}", width="24", height="24">` : `<img src="${false_icon_src}", width="24", height="24">`}</td>
    </tr>`

  return template
}
