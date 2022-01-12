from sales_app.models import Sales
from operations_app.models import Operations
from shipping_app.models import Shipping
from purchases_app.models import Purchases
from ms_app.models import *
import os
import gspread
import time

def reset_database():
  home = os.getcwd() # "./"
  path = home
  all_dir = os.listdir(path)
  sorted_dir = []
  for i in range(len(all_dir)):
    if(("_app" in all_dir[i]) and all_dir[i] != "ms_app" ):
      sorted_dir.append(all_dir[i])
  
  os.system('rm db.sqlite3')

  for i in range(6):

    # Move to select _app folder
    os.chdir(os.path.join(home, sorted_dir[i]))

    #remove migrations folder
    os.system('rm -rf migrations/')
    #remove pycache folder
    os.system('rm -rf __pycache__')

    #Reset to Home after deleetion
    os.chdir(home)

    # os.system('python manage.py makemigrations users_app sales_app accounts_app purchases_app')

    # os.system('python manage.py migrate')
  

def readSheet(sheet):
  gc = gspread.service_account(filename=os.path.join(os.getcwd(),'ms_app/google_dlk_key.json'))
  # Acces Google Sheet "DLK_MASTERSCHEDULE_11_1_2021"
  db = gc.open_by_key("11YmOa5p7BuKbOOzzts9_o4ssghzrxUaT6RBm0YzqnPA")

  if(sheet == "SALES"):
    sales = db.worksheet(sheet)
    start_row = 5
    end_row = 20

    for i in range(start_row, end_row+1):
      active_row = sales.row_values(i)

      project_code = active_row[0].replace(" ","-")
      project_name = active_row[1]
      client_name = active_row[2]
      project_detail = active_row[3]
      invoice_amount = active_row[4]
      order_date = resolveDate(active_row[5],"american") # double check model for null value support
      shipping_date = active_row[6]
      payment_term = active_row[7]
      cancelled = True if (active_row[14] == "TRUE") else False 
      completed = True if (active_row[15] == "TRUE") else False 

      currency, value = resolveInvoiceAmount(invoice_amount)

      new_sale = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term,cancelled=cancelled, completed=completed)

      print("Adding {}...".format(new_sale))
      new_sale.save()
      time.sleep(10)
  elif(sheet == "OPERATION"):
    operation = db.worksheet(sheet)
    start_row = 4
    end_row = 20
    
    for i in range(start_row,end_row+1):
      active_row = operation.row_values(i)
      
      project_code = active_row[0].replace(" ","-")
      project_name = active_row[1]
      client_name = active_row[2]
      status = active_row[3]
      finish_detail = active_row[7]
      cancelled = True if (active_row[8] == "TRUE") else False

      new_operation = Operations(project_code=project_code, project_name=project_name, client_name=client_name, status=status, finish_detail=finish_detail,cancelled=cancelled)
      print("Adding {}...".format(new_operation))
      new_operation.save()
      time.sleep(10)
  elif(sheet == "SHIPPING"):
    shipping = db.worksheet(sheet)
    start_row = 6
    end_row = 22

    for i in range(start_row, end_row+1):
      active_row = shipping.row_values(i)

      project_code = active_row[0].replace(" ", "-")
      project_name = active_row[1]
      client_name = active_row[2]
      germany = active_row[3]
      customer = active_row[4]
      charges = active_row[5]
      remarks = active_row[6]
      cancelled = True if (active_row[7] == "TRUE") else False
      completed = True if (active_row[8] == "TRUE") else False

      new_shipping = Shipping(project_code=project_code, project_name=project_name, client_name=client_name, germany=germany, customer=customer, charges=charges, remarks=remarks, cancelled=cancelled, completed=completed)
      print("Adding {}...".format(new_shipping))
      new_shipping.save()
      time.sleep(10)
  elif(sheet == "PURCHASING"):
    purchases = db.worksheet(sheet)
    start_row = 5
    end_row = 37

    for i in range(start_row, end_row+1):
      active_row = purchases.row_values(i)

      purchase_order = active_row[0]
      project_code = active_row[5]
      po_date = resolveDate(active_row[1],"american") if i <= 15 else resolveDate(active_row[1])
      supplier_name = active_row[2]
      purchased_items = active_row[3]
      invoice_amount = active_row[4]
      expected_date = active_row[6]
      supplier_date = active_row[7]

      currency, value = resolveInvoiceAmount(invoice_amount)
      print(invoice_amount)
      print(currency, value)
      new_purchases = Purchases(purchase_order=purchase_order, project_code=project_code, po_date=po_date, supplier_name=supplier_name, purchased_items=purchased_items, currency=currency, value=value, expected_date=expected_date, supplier_date=supplier_date)
      print("Adding {}...".format(new_purchases))
      new_purchases.save()
      time.sleep(10)




def resolveInvoiceAmount(invoice):
  raw_invoice = invoice.strip()
  format_invoice = raw_invoice.split(" ")

  if(len(format_invoice) == 3):
    return resolveCurrency(format_invoice[0]), format_invoice[2].replace(",", "")

  return resolveCurrency(format_invoice[0]), format_invoice[1].replace(",", "")

def resolveDate(date,format="british"):
  if(date):
    raw_date = date.split("/")

    for i in range(0,len(raw_date)):
      if(len(raw_date[i]) == 1):
        raw_date[i] = "0"+raw_date[i]

    print(raw_date)
    if(format.lower() == "us" or format.lower() == "american"):
      
      # American Format Input : MM/DD/YYYY -> Output: YYYY-MM-DD
      new_date = [raw_date[2], "-", raw_date[0],"-", raw_date[1]]
      return "".join(new_date)

    else:
      # British Format Input : DD/MM/YYYY -> Output: YYYY-MM-DD
      new_date = [raw_date[2],"-",raw_date[1],"-", raw_date[0]]
      return "".join(new_date)
  return None

# print("===== Reseting Database =====")
# reset_database()

# print("===== Reading SALES =====")
# readSheet("SALES")

print("===== Reading OPERATION =====")
readSheet("OPERATION")

print("===== Reading SHIPPING =====")
readSheet("SHIPPING")

print("===== Reading PURCHASING =====")
readSheet("PURCHASING")