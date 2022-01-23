// GET Search API
function searchPurchases(query, library)
{
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

// GET All Purchases
function getAllPurchases() {
  return new Promise ( (resolve, reject) => {
    $.ajax(
    {
      type: "GET",
      url: getAllPurchases_url,
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}

// POST New Purchases
function postNewPurchases(new_purchase) {
  return new Promise ( (resolve, reject) => {
    $.ajax(
    {
      type: "POST",
      headers:
      {
        "X-CSRFToken": token
      },
      url: postNewPurchases_url,
      data:
      {
        'data': new_purchase
      },
      success: function (response) {
       resolve(response)
      },
      error: function (error) {
        reject(error)  
      }
    })
  })
}

// Post Edit Purchases
function postEditPurchases(edit_purchases) {
  return new Promise((resolve, reject) =>{
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": token },
        url: postEditPurchases_url,
        data: { 'data': edit_purchases },
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}
