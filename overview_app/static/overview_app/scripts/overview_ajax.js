// GET all Records AJAX
function getAllRecords(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url,
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}

// GET search Records AJAX
function searchRecords(url, query) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: url.replace(0, query),
      success: function (response) {
        resolve(response)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}