// GET Search API
function searchShipping(query, library)
{
  $.ajax(
    {
      type: "GET",
      url: getSearch_url.replace(0, query),
      success: function(response)
      {
      $("#input-search-clear").addClass("shipping_standard-btn-danger")
        
      if(response.length){
        for (const shipping of response)
        {
          $(".header_title").text(`Found ${response.length} results...`)
          
          shipping["searched"] = true
          addShipping(shipping)
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

// GET Shipping & Display
function getShipping(library, callback) {
  $.ajax(
    {
      type: "GET",
      url: getShipping_url,
      success: function (response) {
        shipping = response.shipping
        shipping_count = shipping.length

        for (i = 0; i < shipping_count; i++) {
          content = shipping.pop()
          library.push(content)
          callback(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// GET: All Shipping 
function getAllShipping(library, callback) {
  $.ajax(
    {
      type: "GET",
      url: getAllShipping_url,
      success: function (response) {
        shipping = response.shipping
        shipping_count = shipping.length

        for (i = 0; i < shipping_count; i++) {
          content = shipping.pop()
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

// Post (new)
function postShipping(new_shipping) {
  $.ajax(
    {
      type: "POST",
      headers:
      {
        "X-CSRFToken": token
      },
      url: postShipping_url,
      data:
      {
        "data": new_shipping
      },
      success: function (response) {
        if (response.error) {
          alert(response.error)
        }
        else {
          addShipping(new_sale)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}