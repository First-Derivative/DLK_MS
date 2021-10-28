// Get Purchases
function getPurchases(obj)
{
  $.ajax(
  {
    type: "GET",
    url: getPurchases_url,
    succes: function(response)
    {
      purchases = request.purchases
      purchases_count = purchases.length
      purchases.reverse()

      for(i = 0; i < purchases_count; i++)
      {
        content = purchases.pop()
        addPurchase(content)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}

function postPurchase(new_purchase)
{
  $.ajax(
  {
    type: "POST",
    headers:
    {
      "X-CSRFToken": token 
    },
    url: postPurchase_url,
    data: 
    {
      'data': new_purchase
    },
    success: function(response)
    {
      if(response.error)
      {
        alert(response.error)
      }
      else
      {
        addPurchase(new_purchase)
      }
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}