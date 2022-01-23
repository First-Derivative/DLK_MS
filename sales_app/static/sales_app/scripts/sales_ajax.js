function searchSales(query) {
  return new Promise ( (resolve, reject) => {
  $.ajax(
    {
      type: "GET",
      url: getSearch_url.replace(0, query),
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
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
    url: getSale_url + request_params,
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
function postNewSales(new_sales) {
  return new Promise( (resolve, reject) => {
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": token },
        url: postNewSales_url,
        data: { "data": new_sales },
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}

// Put (edited) sale
function postEditSales(sale) {
  return new Promise ( (resolve, reject) => {
    $.ajax(
    {
      type: "POST",
      headers: { "X-CSRFToken": token },
      url: postEditSales_url,
      data: sale,
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}