// Add Purchases Handler
$("addPurchases_confirm").click(function() 
{
  // Init
  new_purchase = {purchase_code=null, project_code=null, po_date=null, supplier_date=null, purchased_items=null, value=null, currency=null, expected_date=null, supplier_date=null, cancelled=null}

  // Get & Assign Data
  let data_form = $("form").serializeArray()
  $.each(data_form, function(i, field)
  {
    property= field.name
    new_purchase.property = field.value
  })

  // Calls Ajax postPurchase
  postPurchase(new_purchase)
3})