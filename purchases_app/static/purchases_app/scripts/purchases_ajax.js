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

// GET All Purchases
function getAllPurchases(library, callback) {
  $.ajax(
    {
      type: "GET",
      url: getAllPurchases_url,
      success: function (response) {
        purchases = response.purchases
        purchases_count = purchases.length

        for (i = 0; i < purchases_count; i++) {
          content = purchases.pop()
          library.append(content)
          callback(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// POST New Purchases
function postPurchases(library, new_purchase) {
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
        if (response.error) {
          Object.keys(response.error).forEach(key => 
            { 
              title = propertyToTitle(key)
              error_text_template = `<div class="row text-left edit-validation-update-text" id=""><p class="error-text">${title}: ${response.error[key]}</p></div>`
              $("#modal-errors").prepend(error_text_template)
              $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
            })
        }
        else {
          new_purchase["invoice_amount"] = new_purchase["currency"] + new_purchase["value"]
          library.append(new_purchase)
          addPurchases(new_purchase, true)
          $("#modal-btn-close").trigger( "click" );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
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
