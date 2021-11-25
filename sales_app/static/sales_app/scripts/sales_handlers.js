// UX Functionality: Start Up Sales  Page
function startUpSales() {
  sales_library.clearLibrary()
  $.when(getSales(sales_library)).done(function(){
    for(const sale of sales_library.getLibrary())
    {
      UI_addSale(sale, sale.cancelled)
    }
  })
}

// UX Functionality: Add Sale
$("#modal-btn-save").click(function () {
  // Init
  new_sales = { project_code: null, project_name: null, client_name: null, project_detail: null, value: null, order_date: null, shipping_date: null, payment_term: null, currency: null, cancelled: false }
  $("div[class*=validation-error-text]").each(function () {
    console.log("removing error updates")
    $(this).remove()
  })

  // Get & Assign Data
  let data_form = $(`form[id=modal-form-addSale]`).serializeArray()
  $.each(data_form, function (i, field) {
    property = field.name
    if(property == "order_date")
    {
      src = field.value 
      src = src.replace("/","-")
      src = src.replace("/","-")
      src_split = src.split("-")
      src_split.reverse()
      temp = src_split[2]
      src_split[2] = src_split[1]
      src_split[1] = temp
      
      format_date = src_split.join("-")
      new_sales[property] = format_date
    }
    else if(property == "cancelled")
    {
      new_sales["cancelled"] = true
    }
    else
    {
      new_sales[property] = field.value

    }
  })
  // Calls Ajax postSale which will call UI_AddSale if server-side validation checks out
  postSale(new_sales)
})


// UI Functionality: Add Sale
function UI_addSale(new_sale, search) {

  sales_card_template =
    `<div class="card ${new_sale.cancelled ? 'cancelled-card' : ''}" id="${search ? 'searched_sale' : ''}" name="${new_sale.project_code}">
    <div class="card-header ${new_sale.cancelled ? 'cancelled-card-header' : ''} d-flex justify-content-between">
      <p>${new_sale.project_code} : ${new_sale.project_name} </p>
      <div class="d-flex justify-content-between" style="width:4em">
        <img src="${edit_src}" width="24" height="24" class="hoverable header-img" id="card-edit-${new_sale.project_code}" name="${new_sale.project_code}" alt="Edit Entry">
        <img src="${droparrow_src}" width="24" height="24" class="hoverable header-img" id="card-dropdown-${new_sale.project_code}" name="${new_sale.project_code}" alt="More Info">
      </div>
    </div>
    <div class="card-body d-flex justify-content-between">
      <div class="card_row">
        <p class="card-text">${new_sale.client_name}</p>
        <p class="card-text value">${new_sale.invoice_amount}</p>
        
      </div>
      <div class="card_row>
        <p class="card-text"><span class="text-muted">Customer Order Date: </span>${new_sale.order_date}</p>
        <p class="card-text"><span class="text-muted">Customer Wanted Date: </span>${new_sale.shipping_date}</p>
      </div>
    </div>
    <div class="card-footer hidden" id="card-footer-${new_sale.project_code}">
      <p class="card-text"><span class="text-muted">Project Detail: </span>${new_sale.project_detail}</p>
      <p class="card-text"><span class="text-muted">Payment Detail: </span>${new_sale.payment_term}</p>
    </div>
  </div>`

  $('#sales_display').prepend(sales_card_template)
  dropdown_selector = "#card-dropdown-" + new_sale.project_code

  $(dropdown_selector).on("click", function () {
    id = $(this).attr('name')
    selector = "#card-footer-" + id

    if ($(`#card-footer-${id}`).hasClass("hidden")) {
      $(`#card-footer-${id}`).removeClass("hidden")
    }
    else {
      $(`#card-footer-${id}`).addClass("hidden")
    }
  })

}

// UX Functionality: Handler for #reverse-list button
$("#reverse-list").click(function () {
  $("#sales_display").children().each(function () 
  {
    $("#sales_display").prepend($(this))
  })
})

// UI Functionality: Reverse list
function reverseList() 
{

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
  if(!$(this).is(":checked"))
  {
    $("div[class*=cancelled-card]").each(function () {
      $(this).remove()
    })
    return
  }
  for(const sale of sales_library.getLibrary())
  {
    if (sale.cancelled && search_mode)
    {
      if(sale.searched)
      {
        UI_addSale(sale, true)
      }
    }
    else if(sale.cancelled)
    {
      UI_addSale(sale, true)
    }
  }
})

// UI Functionality: Removes Sale cards from #sales_display
function UI_removeSale(sale_id) {
  $(`div[id*='${sales_id}']`).remove()
}

// UI Functionality: Removes All Sale cards from #sales_display
function UI_removeAll()
{
  $("#sales_display").empty();
}
