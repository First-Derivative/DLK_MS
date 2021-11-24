// UX Functionality: Start Up Sales  Page
function startUpSales() {
  sales_library = []
  $.when(getSales(sales_library)).done(function(){
    for(const sale of sales_library)
    {
      UI_addSale(sale)
    }
  })
}

// UX Functionality: Trigger Modal Display
$('#add_sale').click(function () {
  console.log("modal click")
  $('#modal_addSale').modal()
})

// UX Functionality: Add Sale
$("#modal-btn-save").click(function () {
  // Init
  new_sales = { project_code: null, project_name: null, client_name: null, project_detail: null, value: null, order_date: null, shipping_date: null, payment_term: null, currency: null }

  // Get & Assign Data
  let data_form = $("#modal-form-addSale").serializeArray()
  $.each(data_form, function (i, field) {
    console.log("doing something with each")
    console.log(i, field)
    property = field.name
    new_sales.property = field.value
  })

  console.log(new_sales)

  // Calls Ajax postSale
  // postSale(new_sales)
})


// UI Functionality: Add Sale
function UI_addSale(new_sale, search) {

  sales_card_template =
    `<div class="card ${new_sale.cancelled ? 'cancelled-card' : ''}" id="${search ? 'searched_sale' : ''}" name="${new_sale.project_code}" style="${new_sale.visibility ? 'display:none' : ''}">
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

  $('#sales_display').append(sales_card_template)
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

  /*

  const footer_id = "#card-footer-" + new_sale.project_code
  const dropdown_id = "#card-dropwdown-" + new_sale.project_code
  
  $(document).on("click", "#card-dropdown-DLK-21-0006",function ()
  {
    console.log("click!")
    if($("#card-footer-DLK-21-0006").hasClass("hidden")){
      $("#card-footer-DLK-21-0006").removeClass("hidden")
      return true;
    }
    $(footer_id).addClass("hidden")
  })
  */
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

// UI Functionality: Clears search-text and previous searched_cards for new search
// whilst still in search mode
// function clearSearchDOM() {
//   $("#search-text").remove()
//   $("div[id*=searched_sale]").each(function () {
//     $(this).remove()
//   })
// }

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
  for(const sale of sales_library)
  {
    if(sale.cancelled)
    {
      UI_addSale(sale)
    }
  }
})

// UI Functionality: Removes Sale cards from #sales_display
function UI_removeSale(sale_id) {
  $(`div[id*='${sales_id}']`).remove()
}

function UI_removeAll()
{
  $("#sales_display").empty();
}

// // UI Functionality: Toggle Sale Cards via project_code
// function UI_toggleVisibility(sale_id) {
//   if ($(`div[name=${sale_id}]`).hasClass("hidden")) {
//     $(`div[name=${sale_id}]`).removeClass("hidden")
//     return
//   }
//   $(`div[name=${sale_id}]`).addClass("hidden")
// }

// function UI_toggleAll() {
//   for (const sale of sales_library) {
//     id = sale.project_code
//     if ($(`div[name=${id}]`).hasClass("hidden")) {
//       $(`div[name=${id}]`).removeClass("hidden")
//       continue
//     }
//     $(`div[name=${id}]`).addClass("hidden")

//   }
// }
