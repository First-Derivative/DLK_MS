function searchSales(search_key) {
  $.ajax(
    {
      type: "GET",
      url: getSearchAPI.replace(0, search_key),
      success: function (response) {

        if (response.length) {
          $("#search-text").remove()
          for (const sale of response) {
            sale["searched"] = true
            sales_library.append(sale)
            UI_addSale(sale)
          }
        }
        else {
          $("#search-text").append(`<h5>No results for ${search_key}</h5>`)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// Get Sale
function getSale(params, callback) {
  request_params = "?"

  for (const query in params) {
    request_params += (query + "=" + params[query] + "&")
  }
  $.ajax({
    type: "GET",
    url: getSaleAPI + request_params,
    success: function (response) {
      if (response.hasOwnProperty("error")) {
        console.log("has error")
        console.log(response.error)
      }
      else {
        callback(response)
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}

// Get (all) Sales
function getSales(library) {
  return $.ajax({
    type: "GET",
    url: getSales_url,
    success: function (response) {
      sales = response.sales
      sales_count = sales.length

      sales.reverse() // reverse sales array for performance
      library.setLibrary(sales)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Debugging case
      alert("textStatus: " + textStatus + " " + errorThrown)
    }
  })
}

// Post (new) Sale
function postSale(new_sale) {
  $.ajax(
    {
      type: "POST",
      headers: { "X-CSRFToken": token },
      url: postSales_url,
      data: { "data": new_sale },
      success: function (response) {
        start = 0
        if (response.hasOwnProperty("error")) {
          Object.keys(response.error).forEach(key => {
            error_title = propertyToTitle(key)
            if (start == 0) {
              $("#modal-errors").prepend(`<div class="row text-left validation-error-text" id="modal-error-text-${new_sale.project_code}"><p style="color: #d82d4e">${error_title} : ${response.error[key]}</p></div>`)
              $(`.modal-input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            else {
              $(`#modal-error-text-${new_sale.project_code}`).append(`<p style="color: #d82d4e">${error_title} : ${response.error[key]}</p>`)

              $(`.modal-input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            start = 1
          })
          document.getElementById("modal-form-addSale").scrollIntoView(false)
        }
        if (response.hasOwnProperty("status")) {
          if (response.status == "OK") {
            $("#modal-errors").prepend(`<div class="row text-left validation-error-text"><p>New Sale Added!</p></div>`)
            UI_addSale(new_sale)
            console.log("new sale added")
          }
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// Put (edited) sale
function editSale(sale, callback) {
  $.ajax(
    {
      type: "POST",
      headers: { "X-CSRFToken": token },
      url: editSale_url,
      data: { "edit": sale },
      success: function (response) {
        start = 0
        if (response.hasOwnProperty("error")) {
          Object.keys(response.error).forEach(key => {
            error_title = propertyToTitle(key)
            if (start == 0) {
              $(`card-footer-buttons-${sale.project_code}`).insertBefore(`<div class="row text-left validation-error-text" id="error-text-${new_sale.project_code}"><p style="color: #d82d4e">${error_title} : ${response.error[key]}</p></div>`)
              $(`#input-${key}_${sale.project_code}[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            else {
              $(`#error-text-${new_sale.project_code}`).append(`<p style="color: #d82d4e">${error_title} : ${response.error[key]}</p>`)

              $(`.modal-input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            start == 1
          })
          document.getElementById(`card-body-${sale.project_code}`).scrollIntoView(false)
        }
        else {
          callback(sale)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}