// GET Search API
function searchOperations(query) {
  return new Promise( (resolve, reject) => {
    $.ajax({
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

// Get Operations
function getOperations(obj) {
  $.ajax(
    {
      type: "GET",
      url: getOperations_url,
      success: function (response) {
        operations = request.operations
        operations_count = operations.length
        operations.reverse()

        for (i = 0; operations_count; i++) {
          content = opreations.pop()
          addOpeartions(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// GetAll Operations
function getAllOperations() {
  return new Promise((resolve, reject) => {
    $.ajax(
      {
        type: "GET",
        url: getAllOperations_url,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}

// Post Operations
function postNewOperations(new_operations) {
  return new Promise((resolve, reject) => {
    $.ajax(
    {
      type: "POST",
      headers:
      {
        "X-CSRFToken": token
      },
      url: postNewOperations_url,
      data: { 'data': new_operations },
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
  
}

function postEditOperations(edit_operations) {
  return new Promise((resolve, reject) => {
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": token },
        url: postEditOperations_url,
        data: { 'data': edit_operations },
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}
