// ===== AUXILIARY FUNCTIONS =====

// StartUp Script
function start(library) {
  library.clearLibrary()
  getAllOperations().then((response) => {
    operations = response.operations
    operations_count = operations.length

    for (i = 0; i < operations_count; i++) {
      content = operations.pop()
      library.append(content)
      addOperations(content)
    }
  }).catch((error) => {
    $(`operations_display`).append(`<p class="h5 text-danger> Get Operations Error: Please report bug with the text: ${error} </p>`)
  })

}

function propertyToTitle(property) {
  format = property.split("_")
  for (i = 0; i < format.length; i++) {
    format[i] = format[i].charAt(0).toUpperCase() + format[i].substr(1, format[i].length)
  }
  return format.join(" ")
}

$(`#page_down`).click(function () {
  window.scrollTo(0, document.body.scrollHeight);
})

$(`#page_up`).click(function () {
  window.scrollTo(document.body.scrollHeight, 0);
})

// ===== UI ADD/REMOVE =====

function getTemplate(new_operations) {
  alerted = false

  if (new_operations.status_isNull || new_operations.finish_detail_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-alert-${new_operations.project_code}" style="padding-bottom: 0.2em" name="${new_operations.project_code}" alt="Needs Entry"></div>`

  operations_card_template =
    `<div class="card ${new_operations.cancelled ? 'cancelled-card' : ''} " id="card-${new_operations.project_code}" name="${new_operations.project_code}" edit="0">
    <div class="card-header ${new_operations.cancelled ? 'cancelled-card-header' : ''} d-flex flex-row justify-content-between" id="card-header-${new_operations.project_code}">
      <p id="project_code_${new_operations.project_code}" name="project_code">${new_operations.project_code}</p>
      <div class="d-flex justify-content-between" id="card-header-icons" >
        ${alerted ? alerted_tag : ''}
        <div class="col" style="padding-right:0em;">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_operations.project_code}" name="${new_operations.project_code}" alt="Edit Entry">
        </div>
      </div>
    </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_operations.project_code}">
      <div class="card_row">
        <p class="card-text" id="project_name_${new_operations.project_code}" name="project_name">${new_operations.project_name}</p>
        <p class="card-text" id="client_name_${new_operations.project_code}" name="client_name">${new_operations.client_name}</p>
        <p class="card-text ${new_operations.finish_detail_isNull ? 'missing_text' : ''}" id="finish_detail_${new_operations.project_code}" name="finish_detail"><span class="text-muted">Finish Detail: </span>${new_operations.finish_detail_isNull ? 'null' : new_operations.finish_detail}</p>
      </div>
      <div class="card_row">
        <p class="card-text ${new_operations.status_isNull ? 'missing_text' : ''}" id="status_${new_operations.project_code}" name="status"><span class="text-muted ">Status: </span>${new_operations.status_isNull ? 'null' : new_operations.status}</p>
        <p class="card-text" id="cancelled_${new_operations.project_code}" name="cancelled" value="${(new_operations.cancelled) ? 'true' : 'false'}">
        <span class="text-muted">Cancelled: </span>${new_operations.cancelled ? 'True' : 'False'}
        </p>
      </div>
    </div>
  </div>`

  return operations_card_template
}

// UI Functionality: Add Operations
function addOperations(new_operations, prepend = false, replace = false) {
  // edge-case replace handler
  if (replace == true) {
    operations_card_template = getTemplate(new_operations)
    if( $(`form[id=edit-form-${new_operations.project_code}]`).length > 0 )
    {
      $(`form[id=edit-form-${new_operations.project_code}]`).replaceWith(operations_card_template)
    }
    
    else{ $(`div[id=card-${new_operations.project_code}]`).replaceWith(operations_card_template) }
    
    // Attatching Edit Handler to Replaced Card
    $(`img[id=card-edit-${new_operations.project_code}]`).on("click", function () {
      $(this).empty
      id = $(this).attr("name")
      edit(cache, new_operations.project_code)
    })
    document.getElementById(`card-${new_operations.project_code}`).scrollIntoView({ behavior: "smooth", block: "start" })
    return;
  }

  if ($(`.card[name*='${new_operations.project_code}']`).length > 0) {
    return
  }
  operations_card_template = getTemplate(new_operations)

  // Adding New Operations Card to page
  if (prepend) { $('#operations_display').prepend(operations_card_template) }
  else { $('#operations_display').append(operations_card_template) }

  // Edit button for operations Card Handler
  edit_selector = "#card-edit-" + new_operations.project_code
  $(edit_selector).on("click", function () {
    $(this).empty
    id = $(this).attr("name")
    edit(cache, new_operations.project_code)
  })
}

// Remove All Operation Cards
function removeAllOperations() {
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#operations_display").empty()
}

// Remove Single Operation Card
function removeOperations(project_code) {
  $(`div[id*='${project_code}']`).off() // unbinds handlers
  $(`div[id*='${project_code}']`).remove()
}

// ===== ADD ENTRY FEATURE =====

// Add Operations Handler
$("#modal-btn-save").click(function () {

  new_operations = {}
  new_operations["cancelled"] = false

  $("input[class*=input-error-highlight]").each(function () {
    $(this).removeClass("input-error-highlight")
  })

  $("#modal-errors").empty()

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addOperations]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if (property == "cancelled") {
      new_operations["cancelled"] = true
    }
    else {
      new_operations[property] = field.value
    }
  })
  postNewOperations(new_operations).then((response) => {
    cache.append(new_operations)
    addOperations(new_operations, prepend=true, replace=false)
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
  if (keyPressed === 13) {// Enter Key
    event.preventDefault();

    if (!search_mode) { // check if already in search mode, if false then enter and start search
      enterSearch()
    }
    else {
      removeAllOperations()
    }

    const search_header_template = `
    <div class="row" id="searchHeader">
    <div class="header_title">
    </div>
    </div>
    `
    $("#operations_display").prepend(search_header_template)

    const input_value = $("#input-search").val()
    cache.clearLibrary()
    searchOperations(input_value).then((response) => {
      $("#input-search-clear").addClass("operations_standard-btn-danger")
      if (response.length > 0) {
        for (const operations of response) {
          $(".header_title").text(`Found ${response.length} results...`)
          operations["searched"] = true
          cache.append(operations)
          addOperations(operations)
        }
      }
      else { $(".header_title").text(`No results for ${input_value}`) }
    }).catch( (error) => {
      $(`operations_display`).append(`<p class="h5 text-danger> Server Search Query Error: Please report bug with the text: ${error} </p>`)
    })

  }
})

// UX Functionality: Leave 'search mode' on clear button press
$("#input-search-clear").click(function () {
  $(this).removeClass("operations_standard-btn-danger")
  $("#input-search").val("")
  leaveSearch(cache)
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
  removeAllOperations()
  return true
}

// Leave Search
function leaveSearch() {
  if ($("#input-search-clear").hasClass("operations_standard-btn-danger")) { $("#input-search-clear").removeClass("operations_standard-btn-danger") }
  $("#input-search").val("")
  search_mode = false
  removeAllOperations()
  start(cache)
}

// ===== FILTERING TOGGLES =====

// Cancelled Toggle
$("#input-cancelled").click(function () {
  if (!$(this).is(":checked")) {
    $("div[class*=cancelled-card]").each(function () {
      $(this).remove()
    })
    return
  }
  for (const operations of cache.allCancelled) {
    if (!search_mode) //not in search mode 
    {
      addOperations(operations, prepend=true, replace=false)
    }
    else { if (operations.searched) { addOperations(operations) } }
  }
})

// Reverse List Button
$("#reverse-list").click(function () {
  $("#operations_display").children().each(function () {
    $("#operations_display").prepend($(this))
  })
})

// ===== EDIT FEATURE ======

function edit(library, project_code) {
  edit_check = $(`.card[name=${project_code}]`).attr("edit")

  if (edit_check == "0") {
    $(`.card[name=${project_code}]`).attr("edit", "1") // set active card to edit mode

    $(`#card-${project_code}`).wrap(`<form id="edit-form-${project_code}"></form`)
    $(`#card-body-${project_code}`).removeClass(["d-flex", "justify-content-between"])

    $(`p[id*=${project_code}]`).each(function () {
      field = $(this).attr("name") ? $(this).attr("name") : ''
      dom_value = $(this).text() ? $(this).text() : ''
      value = undefined
      input_field_template = ``
      
      if(field == "cancelled") { value = $(this).attr("value") }

      // Configuring Input DOM based on field
      if (field == "project_code") {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }
      else if (field == "cancelled") {
        input_field_template = `
        <div class="mb-3 form-group d-flex align-items-center" id="${field}_${project_code}">
          <input type="checkbox" class="form-check-input edit-check-input edit-input " id="edit_input_${field}_${project_code}" name="${field}" ${(value == 'true') ? 'checked' : ''}>
          <label for="edit_input_${field}_${project_code}" class="form-label edit-label edit-label-cancelled" id="edit_label_${field}_${project_code}">${propertyToTitle(field)}</label>
        </div>`
      } else {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <label for="edit_input_${field}_${project_code}" class="form-label edit-label ">${propertyToTitle(field)}</label>
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }

      $(this).replaceWith(input_field_template)
      if (field != "cancelled" && (field != "finish_detail" && field != "status")) {
        $(`.edit-input[id*=${field}_${project_code}]`).val(dom_value)
      }
      else if (field == "finish_detail" || field == "status") {
        min = field.length + 2;
        max = dom_value.length
        dom_value = dom_value.substr(min, max)
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

    // Add Footer Template with Cancel & Save buttons
    $(`.card[name=${project_code}]`).append(card_footer_template)
    // Add empty div to house form errors
    $(`#card-body-${project_code}`).append(edit_errors_template)


    // Cancel Edit button handler
    $(`#cancel-edit-${project_code}`).on("click", function () {
      archive = library.getItem(project_code)
      addOperations(archive, prepend=false, replace=true)
    })

    // Save Changes button handler
    $(`#save-edit-${project_code}`).on("click", function () {
      $(`#edit-errors-${project_code}`).empty()

      edit_operations = {}

      // Get & Assign Data
      let data_form = $(`form[id=edit-form-${project_code}]`).serializeArray()
      $.each(data_form, function (i, field) {
        property = field.name
        if (property == "cancelled") {
          edit_operations["cancelled"] = true
        }
        else {
          edit_operations[property] = field.value
        }
      })

      // Make Ajax Call & handle OK response
      postEditOperations(edit_operations).then((response) => {
        new_edit = response.operations
        library.updateItem(new_edit)
        addOperations(new_edit, prepend=false, replace=true)
      }).catch((error) => {
        if (error.responseJSON) {
          Object.keys(error.responseJSON).forEach(key => {
            error_title = propertyToTitle(key)
            $(`#edit-errors-${edit_operations.project_code}`).append(`<p class="error-text"> ${error_title}: ${error.responseJSON[key]}`)
            $(`.edit-input[name=${key}]`).addClass("input-error-highlight")
          })
        }
      })

    })

  }
  else {
    console.log("Already in edit mode")
  }

}
