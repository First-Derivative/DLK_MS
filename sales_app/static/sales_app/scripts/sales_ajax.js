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
            UI_addSale(sale, true)
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


// Get Sales
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
      headers:
      {
        "X-CSRFToken": token
      },
      url: postSales_url,
      data:
      {
        "data": new_sale
      },
      success: function (response) {
        if (response.error) {
          Object.keys(response.error).forEach(key => {
            $("#modal-errors").append(`<p class="text-left">${response.error[key]}</p>`)
            $(`input[name=${key}]`).css("border","0.1em solid #d82d4e")
            console.log("ERROR KEY SELECTOR"+ $(`input[name=${key}]`).val())
          });
        }
        else {
          UI_addSale(new_sale)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}