// Post Shipping Handler
$("postShipping_confirm").click(function() 
{
  // Init
  new_shipping = {project_code=null, project_name=null, client_name=null, customer=null, status=null, remark=null, cancelled=null}

  // Get & Assign Data
  let form_data = $("form").serializeArray()
  $.each(form_data, function(i, field)
  {
    property = field.name
    new_shipping.property = field.value
  })

  // Calls Ajax postOperations
  postShipping(new_shipping)
})