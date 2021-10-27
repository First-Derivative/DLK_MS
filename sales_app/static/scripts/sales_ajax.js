// Get Sales
function getSales(obj)
{
  $.ajax({
    type: "GET",
    url: getSales_url,
    success: function(response)
    {
      sales = request.sales
      sales_count = sales.length

      sales.reverse() // reverse sales array for performance
      for (i = 0; i < sales_count; i++)
      {
        content = sales.pop()
        addSale(content)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}

// Post (new) Sale
function postSale(new_sale)
{
  $.ajax(
  {
    type: "POST",
    headers:
    {
      "X-CSRFToken": token 
    },
    url: postSales_url,
    data:
    {
      'data': new_sale
    },
    success: function(response) 
    {
      if(response.error)
      {
        alert(response.error)
      }
      else
      {
        addSale(new_sale)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}