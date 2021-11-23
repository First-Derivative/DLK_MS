function searchSales(search_key) {
  $.ajax(
    {
      type: "GET",
      url: getSearchAPI.replace(0, search_key),
      success: function (response) {

        if (response.length) {
          $("#search-text").remove()
          for (const sale of response) {
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
      for (i = 0; i < sales_count; i++) {
        content = sales.pop()
        if (i < 15) {
          content.visible = true
        }
        library.push(content)
      }
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
          alert(response.error)
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