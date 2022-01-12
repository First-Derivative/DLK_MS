// ===== AUXILIARY FUNCTIONS =====

// StartUp Script
function start() {
  cache.clearLibrary()
  $.when(getAllOperations(cache,addOperations)).done(function () {
  })
}

// ===== UI ADD/REMOVE =====

// UI Functionality: Add Operations
function addOperations(new_operations, prepend=false) {
  alerted = false
  if($(`.card[name*='${new_operations.project_code}']`).length > 0){
    return
  }

  if(new_operations.status_isNull || new_operations.finish_detail_isNull ) { alerted = true }
  alerted_tag = `<div class="col"><img src="${alertedHD_src}" width="32" height="32" id="card-edit-${new_operations.project_code}" style="padding-bottom: 0.2em" name="${new_operations.project_code}" alt="Needs Entry"></div>`

  operations_card_template =
    `<div class="card ${new_operations.cancelled ? 'cancelled-card' : ''} " id="sales-card-${new_operations.project_code}" name="${new_operations.project_code}">
    <div class="card-header ${new_operations.cancelled ? 'cancelled-card-header' : ''} d-flex flex-row justify-content-between" id="sales-card-header-${new_operations.project_code}">
      <p id="project_code_${new_operations.project_code}">${new_operations.project_code}</p>
      <div class="d-flex justify-content-between" id="card-header-icons">
        ${alerted ? alerted_tag : ''}
        <div class="col" style="padding-right:0em;">
          <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_operations.project_code}" name="${new_operations.project_code}" alt="Edit Entry">
        </div>
      </div>
    </div>
    <div class="card-body d-flex justify-content-between" id="card-body-${new_operations.project_code}">
      <div class="card_row">
        <p class="card-text" id="project_name_${new_operations.project_code}">${new_operations.project_name}</p>
        <p class="card-text" id="client_name_${new_operations.project_code}">${new_operations.client_name}</p>
        <p class="card-text ${ new_operations.finish_detail_isNull ? 'missing_text' : ''}" id="finish_detail_${new_operations.project_code}"><span class="text-muted">Finish Detail: </span>${new_operations.finish_detail_isNull ? 'null' : new_operations.finish_detail}</p>
      </div>
      <div class="card_row">
        <p class="card-text ${ new_operations.status_isNull ? 'missing_text' : ''}" id="status_${new_operations.project_code}"><span class="text-muted ">Status: </span>${new_operations.status_isNull ? 'null' : new_operations.status}</p>
        <p class="card-text" id="cancelled_${new_operations.project_code}"><span class="text-muted">Cancelled: </span>${new_operations.cancelled ? 'True' : 'False'}</p>
      </div>
    </div>
  </div>`

  // Adding New Operations Card to page
  if(prepend){ $('#operations_display').prepend(operations_card_template) }
  else{ $('#operations_display').append(operations_card_template) }

  /*
  // Edit button for sales Card Handler
  edit_selector = "#card-edit-" + new_sale.project_code
  $(edit_selector).on("click", function () {
    id = $(this).attr("name")
    if ($(`#card-footer-${id}`).css('display') == "none") { $(`#card-footer-${id}`).show("fast") }
    enterEditMode(new_sale.project_code)
  })
  */
}

// Remove All Operation Cards
function removeAllOperations()
{
  $(`.card`).each(function () {
    $(this).off()
  })
  $("#operations_display").empty()
}

// Remove Single Operation Card
function removeOperations(project_code)
{
  $(`div[id*='${project_code}']`).off() // unbinds handlers
  $(`div[id*='${project_code}']`).remove()
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
    searchOperations(input_value, cache)
    return false;
  }
})

// UX Functionality: Leave 'search mode' on clear button press
$("#input-search-clear").click(function(){
  $(this).removeClass("operations_standard-btn-danger")
  $("#input-search").val("")
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
  removeAllOperations()
  return true
}

// Leave Search
function leaveSearch()
{
  if ( $("#input-search-clear").hasClass("operations_standard-btn-danger") ){ $("#input-search-clear").removeClass("operations_standard-btn-danger")}
  $("input-search").val("")
  search_mode = false
  removeAllOperations()
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
  for (const operations of cache.allCancelled)
  {
    if(!search_mode) //not in search mode 
    {
      addOperations(operations, true)
    }
    else{ if (operations.searched) { addOperations(operations) }}
  }
})

// Reverse List Button
$("#reverse-list").click(function () {
  $("#operations_display").children().each(function () {
    $("#operations_display").prepend($(this))
  })
})