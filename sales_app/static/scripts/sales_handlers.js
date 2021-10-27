// Add Sales Form Handler
$("#addSales_confirm").click(function()
{
  // Init
  new_sales = {project_code=null, project_name=null, client_name=null, project_detail=null, value=null, order_date=null, shipping_date=null, payment_term=null, currency=null}
  
  // Get & Assign Data
  let data_form = $("form").serializeArray()
  $.each(x, function(i, field)
  {
    property = field.name 
    new_sales.property = field.value
  })

  // Calls Ajax postSale
  postSale(new_sales)
})
