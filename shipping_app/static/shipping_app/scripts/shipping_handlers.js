// ===== AUXILIARY FUNCTIONS =====

// StartUp Script
function start(){
  cache.clearLibrary()
  $.when(getAllShipping(cache, addShipping)).done(function () {
  })
}

// ===== UI ADD/REMOVE =====

// UI Functionality: Add Shipping Card
function addShipping(new_shipping, prepend=false) {

  if($(`.card[name*='${new_shipping.project_code}']`).length > 0){
    return
  }

  alerted = false

  if(new_shipping.germany_isNull || new_shipping.customer_isNull || new_shipping.charges_isNull || new_shipping.remarks_isNull) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-edit-${new_shipping.project_code}" style="padding-bottom: 0.2em" name="${new_shipping.project_code}" alt="Needs Entry"></div>`

  shipping_card_template =
    `<div class="card ${new_shipping.cancelled ? 'cancelled-card' : ''} ${new_shipping.completed ? 'completed-card' : ''}"  id="shipping-card-${new_shipping.project_code}" name="${new_shipping.project_code}">
      <div class="card-header ${new_shipping.cancelled ? 'cancelled-card-header' : ''} ${new_shipping.completed ? 'completed-card-header' : ''} d-flex flex-row justify-content-between" id="shipping-card-header-${new_shipping.project_code}">
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
        <p class="card-text ${new_shipping.charges_isNull ? 'missing_text' : ''}" id="charges_${new_shipping.project_code}" id="charges_${new_shipping.project_code}"><span class="text-muted">Charges: </span>${new_shipping.charges == undefined ? 'null' : new_shipping.charges}</p>

        <p class="card-text ${new_shipping.germany_isNull ? 'missing_text' : ''}" id="germany_${new_shipping.project_code}"><span class="text-muted">Shipping From Germany: </span>${new_shipping.germany_isNull ? 'null' : new_shipping.germany}</p>

        <p class="card-text ${new_shipping.customer_isNull ? 'missing_text' : ''}" id="customer_${new_shipping.project_code}"><span class="text-muted">Shipping From Customer: </span>${new_shipping.customer_isNull ? 'null' : new_shipping.customer}</p>
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
    // enterEditMode(new_shipping.project_code)
  })

}

// UI Functionality: Remove all Shipping Cards
function removeAllShipping()
{
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#shipping_display").empty()
}

function removeShipping(shipping_id)
{
  $(`div[id*='${shipping_id}']`).off() // unbinds handlers
  $(`div[id*='${shipping_id}']`).remove()
}


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
  $("input-search").val("")
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