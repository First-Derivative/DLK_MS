// Get Shipping & Display
function getShipping(obj) {
  $.ajax(
    {
      type: "GET",
      url: getShipping_url,
      success: function (response) {
        shipping = request.shipping
        shipping_count = shipping.length

        shipping.reverse() // reverse sales array for performance
        for (i = 0; i < shipping_count; i++) {
          content = shipping.pop()
          addShipping(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// GET: All Shipping 
function getAllShipping(callback) {
  $.ajax(
    {
      type: "GET",
      url: getAllShipping_url,
      success: function (response) {
        shipping = response.shipping
        shipping_count = shipping.length

        shipping.reverse() // reverse sales array for performance
        for (i = 0; i < shipping_count; i++) {
          content = shipping.pop()
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