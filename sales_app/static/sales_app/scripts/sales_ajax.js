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
            cache.append(sale)
            UI_addSale(sale)
          }
        }
        else {
          $("#search-text").text(`No results for ${search_key}`)
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
function getAllSales(library) {
  return new Promise ( (resolve, reject) => {
    $.ajax({
      type: "GET",
      url: getAllSales_url,
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}

// Post (new) Sale
function postSale(library, new_sales) {
  $.ajax(
    {
      type: "POST",
      headers: { "X-CSRFToken": token },
      url: postSales_url,
      data: { "data": new_sales },
      success: function (response) {
        start = 0
        if (response.hasOwnProperty("error")) {
          Object.keys(response.error).forEach(key => {
            error_title = propertyToTitle(key)
            if (start == 0) {
              $("#modal-errors").prepend(`<div class="row text-left modal-validation-update-text" id="modal-error-text-${new_sales.project_code}"><p style="color: #d82d4e">${error_title} : ${response.error[key]}</p></div>`)
              $(`.modal-input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            else {
              $(`#modal-error-text-${new_sales.project_code}`).append(`<p style="color: #d82d4e">${error_title} : ${response.error[key]}</p>`)

              $(`.modal-input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            start = 1
          })
        }
        if (response.hasOwnProperty("status")) {
          if (response.status == "OK") {
            new_sales["invoice_amount"] = new_sales["currency"] + new_sales["value"]
            library.append(new_sales)
            UI_addSale(new_sales)
            $("#modal-btn-close").trigger( "click" )
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
      data: sale,
      success: function (response) {
        start = 0
        if (response.hasOwnProperty("error"))
        {
          Object.keys(response.error).forEach(key => {
            error_title = propertyToTitle(key)
            if (start == 0) {
              $(`#card-footer-${sale.project_code}`).append(`<div class="row text-left edit-validation-update-text mt-3" id="error-text-${sale.project_code}"><p style="color: #d82d4e">${error_title} : ${response.error[key]}</p></div>`)
              $(`#input_${key}_${sale.project_code}[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            else {
              $(`#error-text-${sale.project_code}`).append(`<p style="color: #d82d4e">${error_title} : ${response.error[key]}</p>`)

              $(`.input[name=${key}]`).css("border", "0.1em solid #d82d4e")
            }
            start == 1
          })
          document.getElementById(`card-footer-${sale.project_code}`).scrollIntoView(false)
        }
        else
        {
          sale["invoice_amount"] = resolveCurrency(sale["currency"]) + sale["value"]
          callback(sale)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}