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
function UI_addSale(new_sale) {

  sales_card_template =
    `<div class="card" name="${new_sale.project_code}">
    <div class="card-header d-flex justify-content-between">
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

  $('#main_content').append(sales_card_template)
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
