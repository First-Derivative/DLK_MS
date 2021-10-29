// Add Sales Form Handler
$("#addSales_confirm").click(function()
{
  // Init
  new_sales = {project_code=null, project_name=null, client_name=null, project_detail=null, value=null, order_date=null, shipping_date=null, payment_term=null, currency=null}
  
  // Get & Assign Data
  let data_form = $("form").serializeArray()
  $.each(data_form, function(i, field)
  {
    property = field.name 
    new_sales.property = field.value
  })

  // Calls Ajax postSale
  postSale(new_sales)
})

// UI Functionality: Add Sale
function addSale(new_sale)
{
  sale_item_template = `<div> {} </div>`
/*
  sales_id = 
  project_code =
  project_name =
  client_name =
  project_detail =
  value =
  currency =
  order_date = 
  shipping_date =
  payment_term =
  cancelled = 
*/


}