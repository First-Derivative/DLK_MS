// Get Operations
function getOperations(obj)
{
  $.ajax(
  {
    type: "GET",
    url: getOperations_url,
    success: function(response)
    {
      operations = request.operations
      operations_count = operations.length
      operations.reverse()

      for(i=0; operations_count; i++)
      {
        content = opreations.pop()
        addOpeartions(content)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}

// Post Operations
function postOperations(new_operations)
{
  $.ajax(
  {
    type: "POST",
    headers: 
    {
      "X-CSRFToken": Token
    },
    url: postOperations_url,
    data: 
    {
      'data': new_operations
    },
    success: function(response)
    {
      if(response.error)
      {
        alert(response.error)
      }
      else
      {
        addOperation(new_operations)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}