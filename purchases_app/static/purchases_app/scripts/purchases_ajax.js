// GET Search API
function searchPurchases(query, library)
{
  library.clearLibrary()
  $.ajax(
    {
      type: "GET",
      url: getSearch_url.replace(0, query),
      success: function(response)
      {
      $("#input-search-clear").addClass("purchases_standard-btn-danger")
        
      if(response.length){
        for (const purchases of response)
        {
          $(".header_title").text(`Found ${response.length} results...`)
          
          purchases["searched"] = true
          library.append(purchases)
          addPurchases(purchases)
        }
      }
      else
      {
        $(".header_title").text(`No results for ${query}`)
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }

  })
}

function getAllPurchases(callback) {
  $.ajax(
    {
      type: "GET",
      url: getAllPurchases_url,
      success: function (response) {
        purchases = response.purchases
        purchases_count = purchases.length
        purchases.reverse()

        for (i = 0; i < purchases_count; i++) {
          content = purchases.pop()
          callback(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}


// Post New Purchases
function postPurchase(new_purchase) {
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
      success: function (response) {
        if (response.error) {
          alert(response.error)
        }
        else {
          addPurchase(new_purchase)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}