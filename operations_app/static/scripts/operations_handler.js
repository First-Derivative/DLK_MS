// Post Operations Handler
$("postOperations_confirm").click(function()
{
  // Init
  new_operations = {project_code=null, project_name=null, client_name=null, status=null, finish_detail=null, cancelled=null}

  // Get & Assign Data
  let form_data = $("form").serializeArray()
  $.each(form_data, function(i, field)
  {
    property = field.name
    new_operations.property = field.value
  })

  // Calls Ajax postOperations
  postOperations(new_operations)
})