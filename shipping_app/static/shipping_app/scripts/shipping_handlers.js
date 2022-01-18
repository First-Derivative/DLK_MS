// ===== AUXILIARY FUNCTIONS =====

// StartUp Script
function start(){
  cache.clearLibrary()
  $.when(getAllShipping(cache, addShipping)).done(function () {
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

// ===== UI ADD/REMOVE =====

// UI Functionality: Add Shipping Card
function addShipping(new_shipping, prepend=false) {

  if($(`.card[name*='${new_shipping.project_code}']`).length > 0){
    return
  }
  alerted = false

  if(new_shipping.germany_isNull || new_shipping.customer_isNull || new_shipping.charges_isNull || new_shipping.remarks_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-alert-${new_shipping.project_code}" style="padding-bottom: 0.2em" name="${new_shipping.project_code}" alt="Needs Entry"></div>`

  shipping_card_template =
    `<div class="card ${new_shipping.cancelled ? 'cancelled-card' : ''} ${new_shipping.completed ? 'completed-card' : ''}"  id="card-${new_shipping.project_code}" name="${new_shipping.project_code}" edit="0">
      <div class="card-header ${new_shipping.cancelled ? 'cancelled-card-header' : ''} ${new_shipping.completed ? 'completed-card-header' : ''} d-flex flex-row justify-content-between" id="card-header-${new_shipping.project_code}">
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
        <p class="card-text ${new_shipping.charges_isNull ? 'missing_text' : ''}" id="charges_${new_shipping.project_code}" id="charges_${new_shipping.project_code}"><span class="text-muted">Charges: </span>${new_shipping.charges_isNull ? 'null' : new_shipping.charges}</p>

        <p class="card-text ${new_shipping.germany_isNull ? 'missing_text' : ''}" id="germany_${new_shipping.project_code}"><span class="text-muted">Shipping From Germany: </span>${new_shipping.germany_isNull ? 'null' : new_shipping.germany}</p>

        <p class="card-text ${new_shipping.customer_isNull ? 'missing_text' : ''}" id="customer_${new_shipping.project_code}"><span class="text-muted">Shipping To Customer: </span>${new_shipping.customer_isNull ? 'null' : new_shipping.customer}</p>
      </div>
    </div>
    <div class="card-footer" id="card-footer-${new_shipping.project_code}">
      <p class="card-text ${new_shipping.remarks_isNull ? 'missing_text' : ''}" id="remarks_${new_shipping.project_code}"><span class="text-muted">Remarks: </span>${new_shipping.remarks_isNull ? 'null' : new_shipping.remarks}</p>

      <p class="card-text" id="cancelled_${new_shipping.project_code}"><span class="text-muted">Cancelled: </span>${new_shipping.cancelled ? 'True' : 'False'}</p>

      <p class="card-text" id="completed_${new_shipping.project_code}"><span class="text-muted">Completed: </span>${new_shipping.completed ? 'True' : 'False'}</p>
    </div>
  </div>`

  // Adding New Shipping Card to page
  if(prepend){ $('#shipping_display').prepend(shipping_card_template) }
  else{ $('#shipping_display').append(shipping_card_template) }

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
    enterEdit(cache, new_shipping.project_code)
  })

}

// Remove all Shipping Cards
function removeAllShipping()
{
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#shipping_display").empty()
}

// Remove singular Shipping Card
function removeShipping(shipping_id)
{
  $(`div[id*='${shipping_id}']`).off() // unbinds handlers
  $(`div[id*='${shipping_id}']`).remove()
}
// ===== ADD ENTRY FEATURE =====

// Add Shipping Handler
$("#modal-btn-save").click(function () {

  new_shipping = {}
  new_shipping["cancelled"] = false
  new_shipping["completed"] = false

  $("input[class*=input-error-highlight]").each(function () {
    $(this).removeClass("input-error-highlight")
  })

  $("#modal-errors").empty()

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addShipping]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if (property == "cancelled") {
      new_shipping["cancelled"] = true
    }
    else if (property == "completed") {
      new_shipping["completed"] = true
    }
    else {
      new_shipping[property] = field.value
    }
  })


  postShipping(cache, new_shipping)
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
      removeAllShipping()
    }
    
    const search_header_template = `
    <div class="row" id="searchHeader">
    <div class="header_title">
    </div>
    </div>
    `
    $("#shipping_display").prepend(search_header_template)
    
    const input_value = $("#input-search").val()
    searchShipping(input_value, cache)
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
  removeAllShipping()
  return true
}

// Leave Search
function leaveSearch()
{
  if ( $("#input-search-clear").hasClass("shipping_standard-btn-danger") ){ $("#input-search-clear").removeClass("shipping_standard-btn-danger")}
  $("#input-search").val("")
  search_mode = false
  removeAllShipping()
  start()
}

// ===== FILTERING TOGGLES =====

// Cancelled Toggle
$("#input-cancelled").click(function ()
{
  if (!$(this).is(":checked"))
  {
    $("div[class*=cancelled-card]").each(function ()
    {
      $(this).remove()
    })
    return
  }
  for (const shipping of cache.allCancelled)
  {
    if(!search_mode) //not in search mode 
    {
      addShipping(shipping, true)
    }
    else{ if (shipping.searched) { addShipping(shipping) }}
  }
})

// Completed Toggle
$("#input-completed").click(function ()
{
  if (!$(this).is(":checked"))
  {
    $("div[class*=completed-card]").each(function ()
    {
      $(this).remove()
    })
    return
  }
  for (const shipping of cache.allCompleted)
  {
    if(!search_mode) //not in search mode 
    {
      addShipping(shipping, true)
    }
    else{ if (shipping.searched) { addShipping(shipping) }}
  }
})

// Reverse List Button
$("#reverse-list").click(function () {
  $("#shipping_display").children().each(function () {
    $("#shipping_display").prepend($(this))
  })
})

// ===== EDIT FEATURE ======

// enter editMode
function enterEdit(library, project_code) {
  edit_check = $(`.card[name=${project_code}]`).attr("edit")

  if (edit_check == "0") {
    $(`.card[name=${project_code}]`).attr("edit", "1") // set active card to edit mode

    $(`#card-${project_code}`).wrap(`<form id="edit-form-${project_code}"></form`)
    $(`#card-body-${project_code}`).removeClass(["d-flex", "justify-content-between"])
    $(`#card-footer-${project_code}`).css("display", "block")
    $(`#card-dropdown-${project_code}`).parent().hide()

    shipping = library.getItem(project_code)

    $(`p[id*=${project_code}]`).each(function () {
      field = $(this).attr("id")
      field = field.substr(0, field.length - 12)
      input_field_template = ``

      // Configuring Input DOM based on field
      if (field == "project_code") {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }
      else if (field == "cancelled" || field == "completed") {
        input_field_template = `
        <div class="mb-3 form-group d-flex align-items-center" id="${field}_${project_code}">
          <input type="checkbox" class="form-check-input edit-check-input edit-input " id="edit_input_${field}_${project_code}" name="${field}" ${(shipping[field]) ? 'checked' : ''}>
          <label for="edit_input_${field}_${project_code}" class="form-label edit-label edit-label-checkbox" id="edit_label_${field}_${project_code}">${propertyToTitle(field)}</label>
        </div>`
      } else {
        input_field_template = `
        <div class="mb-3 form-group" id="${field}_${project_code}">
          <label for="edit_input_${shipping.field}_${project_code}" class="form-label edit-label ">${propertyToTitle(field)}</label>
          <input type="text" class="form-control edit-input" id="edit_input_${field}_${project_code}" name="${field}">
        </div>`
      }

      $(this).replaceWith(input_field_template)

      if (field != "cancelled" || field != "completed") {
        $(`.edit-input[id*=${field}_${project_code}]`).val(shipping[field])
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
    $(`#card-footer-${project_code}`).append(edit_errors_template)

    // Cancel Edit button handler
    $(`#cancel-edit-${project_code}`).on("click", function () {
      leaveEdit(library, project_code)
    })

    // Save Changes button handler
    $(`#save-edit-${project_code}`).on("click", function () {

      $(`#edit-errors-${project_code}`).empty()

      edit_shipping = {}

      // Get & Assign Data
      let data_form = $(`form[id=edit-form-${project_code}]`).serializeArray()
      $.each(data_form, function (i, field) {
        property = field.name
        if (property == "cancelled") {
          edit_shipping["cancelled"] = true
        }
        else if(property == "completed") 
        {
          edit_shipping["completed"] = true
        }
        else {
          edit_shipping[property] = field.value
        }
      })
      // Make Ajax Call & handle OK response
      postEditShipping(edit_shipping).then((response) => {
        library.updateItem(edit_shipping)
        leaveEdit(library, project_code)
      }).catch((error) => {
        if(error.responseJSON){
          Object.keys(error.responseJSON).forEach(key => {
            error_title = propertyToTitle(key)
            $(`#edit-errors-${edit_shipping.project_code}`).append(`<p class="error-text"> ${error_title}: ${error.responseJSON[key]}`)
            $(`.edit-input[name=${key}]`).addClass("input-error-highlight")
          })
        }
      })
      
    })

  }
  else {
    leaveEdit(library, project_code)
  }
}

// leave editMode
function leaveEdit(library, project_code) {
  edit_check = $(`.card[name=${project_code}]`).attr("edit")

  if (edit_check == "1") {
    $(`.card[name=${project_code}]`).attr("edit", "0") // set active card to !edit mode
    $(`#card-${project_code}`).unwrap() //unwraps <form> from card

    shipping = library.getItem(project_code)

    $(`.form-group[id*=${project_code}]`).each(function () {
      field = $(this).attr("id")
      field = field.substr(0, field.length - 12)

      if (field == "project_name" || field == "client_name" || field == "project_code") {
        card_text_template = `<p class="card-text" id="${field}_${project_code}"> ${shipping[field]} </p>`
      }
      else if(field == "cancelled" || field == "completed")
      {
        card_text_template = `<p class="card-text" id="${field}_${project_code}"><span class="text-muted">${propertyToTitle(field)}:</span> ${ (shipping[field]) ? 'True' : 'False'}</p>`
      }
      else {
        card_text_template = `<p class="card-text" id="${field}_${project_code}"><span class="text-muted">${propertyToTitle(field)}:</span> ${shipping[field]}</p>`
      }

      $(this).empty()
      $(this).replaceWith(card_text_template)

      document.getElementById(`card-${project_code}`).scrollIntoView({behavior: "smooth", block: "start"})
    })

    $(`#card-alert-${project_code}`).unwrap();$(`#card-alert-${project_code}`).remove();
    $(`#edit-errors-${project_code}`).remove()
    $(`#card_footer_${project_code}`).remove()
    $(`#card-body-${project_code}`).addClass(["d-flex", "justify-content-between"])
    $(`#card-footer-${project_code}`).css("display", "")
    $(`#card-dropdown-${project_code}`).parent().show("fast")

    // Edit Cancelled Handlers
    if (shipping.cancelled && !$(`#card-${project_code}`).hasClass("cancelled-card")) {
      $(`#card-${project_code}`).addClass("cancelled-card")
      $(`#card-header-${project_code}`).addClass("cancelled-card-header")
    }
    
    if (!shipping.cancelled && $(`#card-${project_code}`).hasClass("cancelled-card")) {
      $(`#card-${project_code}`).removeClass("cancelled-card")
      $(`#card-header-${project_code}`).removeClass("cancelled-card-header")
    }

    // Edit Completed Handlers
    if (shipping.completed && !$(`#card-${project_code}`).hasClass("completed-card")) {
      $(`#card-${project_code}`).addClass("completed-card")
      $(`#card-header-${project_code}`).addClass("completed-card-header")
    }
    
    if (!shipping.completed && $(`#card-${project_code}`).hasClass("completed-card")) {
      $(`#card-${project_code}`).removeClass("completed-card")
      $(`#card-header-${project_code}`).removeClass("completed-card-header")
    }
  }
  else {
    console.log("edge-case: leaveEdit() called when edit attr is false on card")
  }
}
