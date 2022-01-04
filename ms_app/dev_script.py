from sales_app.models import Sales
from operations_app.models import Operations
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
    if("_app" in all_dir[i]):
      sorted_dir.append(all_dir[i])
  
  os.system('rm db.sqlite3')

  for i in range(8):

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
    end_column = 8

    project_code = None
    project_name = None
    client_name = None
    project_detail = ""
    value = None
    currency = None
    order_date = None
    shipping_date = None
    payment_term = None
    cancelled = None
    completed = None

    # Read and Store Sales with gSpread
    for i in range(start_row, end_row+1):
      project_code = sales.cell(i,1).value.replace(" ","-")
      project_name = sales.cell(i,2).value
      client_name = sales.cell(i,3).value
      project_detail = sales.cell(i,4).value
      invoice_amount = sales.cell(i,5).value
      currency, value = resolveInvoiceAmount(invoice_amount)
      order_date = resolveDate(sales.cell(i,6).value)
      shipping_date = sales.cell(i,7).value
      payment_term = sales.cell(i,8).value
      
      new_sale = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term,completed=False)

      print("Adding {}...".format(new_sale))
      new_sale.save()
      time.sleep(60)
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



def resolveInvoiceAmount(invoice):
  raw_invoice = invoice.strip()
  format_invoice = raw_invoice.split(" ")

  if(len(format_invoice) == 3):
    return resolveCurrency(format_invoice[0]), format_invoice[2].replace(",", "")

  return resolveCurrency(format_invoice[0]), format_invoice[1].replace(",", "")

def resolveDate(date):
  if(date):
    date_unbound = date.split("/")

    if(len(date_unbound[0]) == 1):
      date_unbound[0] = "0"+date_unbound[0]

    new_date = [date_unbound[2],"-",date_unbound[0],"-", date_unbound[1]]
    return "".join(new_date)
  return None

# reset_database()
readSheet("OPERATION")