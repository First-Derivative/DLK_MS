// GET Search API
function searchShipping(query)
{
  return new Promise ( (resolve, reject) => {
    $.ajax(
    {
      type: "GET",
      url: getSearch_url.replace(0, query),
      success: function(response)
      {
        resolve(response)          
      },
      error: function (error) {
        reject(error)
      }
  
    })
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
function getAllShipping() {
  return new Promise( (resolve, reject) => {
    $.ajax(
      {
        type: "GET",
        url: getAllShipping_url,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}
// Post (new)
function postShipping(library, new_shipping) {
  $.ajax(
    {
      type: "POST",
      headers:
      {
        "X-CSRFToken": token
      },
      url: postNewShipping_url,
      data:
      {
        "data": new_shipping
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
          library.append(new_shipping)
          addShipping(new_shipping, true)
          $("#modal-btn-close").trigger( "click" );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// Post Edit
function postEditShipping(edit_shipping) {
  return new Promise((resolve, reject) =>{
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": token },
        url: postEditShipping_url,
        data: { 'data': edit_shipping },
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}
