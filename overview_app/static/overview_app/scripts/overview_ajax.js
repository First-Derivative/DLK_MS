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

// POST new Records AJAX
function postNewRecords(url, record) {
  return new Promise((resolve, reject) => {
    $.ajax(
      {
        type: "POST",
        headers:
        {
          "X-CSRFToken": token
        },
        url: url,
        data: record,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}

// POST edit Records AJAX
function postEditRecords(url, record) {
  return new Promise((resolve, reject) =>{
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": token },
        url: url,
        data: record,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}
