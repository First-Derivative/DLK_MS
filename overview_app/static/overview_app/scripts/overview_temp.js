// ===== REPORT FEATURE =====

$(`#reportModal-save`).click(function () {
  console.log("save clicked")
  report = {}

  // Get & Assign Data
  let data_form = $(`#modal-form-report`).serializeArray()
  $(`form[id=report_form]`)
  $.each(data_form, function (i, field) {
    property = field.name
    report[property] = field.value
  })
  report["location"] = window.location.href
  console.log(report)
  // Make Ajax Call & handle OK response
  postReport(report).then((response) => {
    $(`#report-output`).empty()
    $(`#report-output`).append(`<p class="text-success"> Report recorded! Thank you <p>`)
  }).catch((error) => {
    if (error.responseJSON) {
      Object.keys(error.responseJSON).forEach(key => {
        error_title = propertyToTitle(key)
        $(`#report-output`).append(`<div class="row"> <p class="error-text"> ${error_title}: ${error.responseJSON[key]}</p> </div>`)
        $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
      })
    }
  })
})


// Post (new) Report
function postReport(report) {
  return new Promise((resolve, reject) => {
    $.ajax(
      {
        type: "POST",
        headers: { "X-CSRFToken": report_token },
        url: postReport_url,
        data: report,
        success: function (response) {
          resolve(response)
        },
        error: function (error) {
          reject(error)
        }
      })
  })
}