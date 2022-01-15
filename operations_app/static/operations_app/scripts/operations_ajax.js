// GET Search API
function searchOperations(query, library)
{
  library.clearLibrary()
  $.ajax({
    type: "GET",
    url: getSearch_url.replace(0, query),
    success: function(response)
    {
    $("#input-search-clear").addClass("operations_standard-btn-danger")
      
    if(response.length){
      for (const operations of response)
      {
        $(".header_title").text(`Found ${response.length} results...`)
        
        operations["searched"] = true
        library.append(operations)
        addOperations(operations)
      }
    }
    else
    {
      $(".header_title").text(`No results for ${query}`)
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    // Debugging case
    alert("textStatus: " + textStatus + " " + errorThrown)
  }
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
function getAllOperations(library, callback) {
  $.ajax(
    {
      type: "GET",
      url: getAllOperations_url,
      success: function (response) {
        operations = response.operations
        operations_count = operations.length

        for (i = 0; i < operations_count; i++) {
          content = operations.pop()
          library.append(content)
          callback(content)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

// Post Operations
function postNewOperations(library, new_operations) {
  $.ajax(
    {
      type: "POST",
      headers:
      {
        "X-CSRFToken": token
      },
      url: postNewOperations_url,
      data:
      {
        'data': new_operations
      },
      success: function (response) {
        if (response.error) { // error handling
          Object.keys(response.error).forEach(key => 
          { 
            title = propertyToTitle(key)
            error_text_template = `<div class="row text-left edit-validation-update-text" id=""><p class="error-text">${title}: ${response.error[key]}</p></div>`
            $("#modal-errors").prepend(error_text_template)
            $(`.modal-input[name=${key}]`).addClass("input-error-highlight")
          })
        }
        else {
          library.append(new_operations)
          addOperations(new_operations,true)
          $("#modal-btn-close").trigger( "click" );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}

function postEditOperations(library, edit_operations)
{
  $.ajax(
    {
      type: "POST",
      headers: { "X-CSRFToken": token },
      url: postEditOperations_url,
      data: { 'data': edit_operations},
      success: function (response)
      {
        if (response.error) { // error handling
          console.log("in error handling")
          Object.keys(response.error).forEach(key => 
          { 
            error_title = propertyToTitle(key)
            $(`#edit-errors-${edit_operations.project_code}`).append(`<p class="error-text"> ${error_title}: ${response.error[key]}`)
            $(`.edit-input[name=${key}]`).addClass("input-error-highlight")
          })
        }
        else {
          library.updateItem(edit_operations)
          console.log("ajax: " + edit_operations)
          leaveEdit(library, edit_operations)
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Debugging case
        alert("textStatus: " + textStatus + " " + errorThrown)
      }
    })
}