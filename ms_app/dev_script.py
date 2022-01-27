import re
from pymysql import NULL
from sales_app.models import Sales
from operations_app.models import Operations
from shipping_app.models import Shipping
from purchases_app.models import Purchases
from accounts_app.models import PaymentStatus
from ms_app.models import *
from overview_app.models import *
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
  
  # os.system('rm db.sqlite3')

  for i in range(6):

    # Move to select _app folder
    os.chdir(os.path.join(home, sorted_dir[i]))

    #remove migrations folder
    os.system('rm -rf migrations/')
    #remove pycache folder
    os.system('rm -rf __pycache__')

    #Reset to Home after deleetion
    os.chdir(home)

  os.system('python manage.py makemigrations users_app')
  # os.system('python manage.py migrate')
  # os.system('python manage.py createsuperuser')
  os.system('python manage.py makemigrations sales_app accounts_app shipping_app purchases_app operations_app overview_app')
  os.system('python manage.py migrate')

  print("Done Setting up DB ")

    # os.system('python manage.py migrate')
    # Done Reseting DB's
  

def reset_migrations():
  home = os.getcwd() # "./"
  path = home
  all_dir = os.listdir(path)
  sorted_dir = []
  for i in range(len(all_dir)):
    if(("_app" in all_dir[i]) and all_dir[i] != "ms_app" ):
      sorted_dir.append(all_dir[i])
  
  # os.system('rm db.sqlite3')

  for i in range(6):

    # Move to select _app folder
    os.chdir(os.path.join(home, sorted_dir[i]))

    #remove migrations folder
    os.system('rm -rf migrations/')
    #remove pycache folder
    os.system('rm -rf __pycache__')

    #Reset to Home after deleetion
    os.chdir(home)

  os.system('python manage.py makemigrations users_app')
  os.system('python manage.py makemigrations sales_app accounts_app shipping_app purchases_app operations_app overview_app')
  os.system('python manage.py migrate')
  

# CUSTOM READSHEET FUNCTION FOR FILE: 'DLK - MASTER SCHEDULE LQ2021 & 2022_COPY'
def readSheet(sheet):
  gc = gspread.service_account(filename=os.path.join(os.getcwd(),'ms_app/google_dlk_key.json'))
  db = gc.open_by_key("13ww8cRY13CSD7_pc3J7zuXDHClNLqZDt4KMCGzus-Dg")

  if(sheet == "SALES"):
    sales = db.worksheet(sheet)
    start_row = 22
    end_row = 59
    missed = []

    for i in range(start_row, end_row+1):
      try:
        active_row = sales.row_values(i)

        project_code = active_row[0].replace(" ","-")
        project_name = active_row[1]
        client_name = active_row[2]
        project_detail = active_row[3] if (active_row[3] != '') else "null"
        invoice_amount = active_row[4]
        order_date = resolveDate(active_row[5],"american")
        shipping_date = active_row[6] if (active_row[6] != '') else 'null'
        payment_term = active_row[7] if (active_row[7] != '') else 'null'
        cancelled = True if (active_row[8] == "TRUE") else False 
        completed = True if (active_row[9] == "TRUE") else False 

        currency, value = resolveInvoiceAmount(invoice_amount)

        new_sales = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term,cancelled=cancelled, completed=completed)

        print("Added {}...".format(new_sales))
        new_sales.save()
        time.sleep(1)
      except Exception as e:
        missed.append({"row":i, "exception": e})
    
    for i in range(0, len(missed)):
      new_report = Report(title="Missing Sales Entry", body="row:{i}, exception: {e}".format(i=str(missed[i]["row"]), e=str(missed[i]["exception"])), location='Importing page {sheet} from dev_script'.format(sheet=sheet))
      print("saving new report {new_report}".format(new_report=new_report))
      new_report.save()


  elif(sheet == "OPERATION"):
    operation = db.worksheet(sheet)
    start_row = 4
    end_row = 58
    missed = []

    for i in range(start_row,end_row+1):
      try:
        active_row = operation.row_values(i)
        
        project_code = active_row[0].replace(" ","-")
        project_name = active_row[1]
        client_name = active_row[2]
        status = active_row[3] if (active_row[3] != 'null') else 'null'
        finish_detail = active_row[7] if (active_row[7] != '') else 'null'
        cancelled = True if (active_row[8] == "TRUE") else False

        new_operation = Operations(project_code=project_code, project_name=project_name, client_name=client_name, status=status, finish_detail=finish_detail,cancelled=cancelled)
        print("Added {}...".format(new_operation))
        new_operation.save()
        time.sleep(1)
      except Exception as e:
        missed.append({"row":i, "exception": e})

    for i in range(0, len(missed)):
      new_report = Report(title="Missing Operations Entry", body="row:{i}, exception: {e}".format(i=str(missed[i]["row"]), e=str(missed[i]["exception"])), location='Importing page {sheet} from dev_script'.format(sheet=sheet))
      print("saving new report {new_report}".format(new_report=new_report))
      new_report.save()

  elif(sheet == "SHIPPING"):
    shipping = db.worksheet(sheet)
    start_row = 6
    end_row = 57
    missed = []
    
    for i in range(start_row, end_row+1):
      try:
        active_row = shipping.row_values(i)

        project_code = active_row[0].replace(" ", "-")
        project_name = active_row[1]
        client_name = active_row[2]
        germany = active_row[3] if (active_row[3] != '') else 'null'
        customer = active_row[4] if (active_row[4] != '') else 'null'
        charges = active_row[5] if (active_row[5] != '') else 'null'
        remarks = active_row[6] if (active_row[6] != '') else 'null' 
        cancelled = True if (active_row[7] == "TRUE") else False
        completed = True if (active_row[8] == "TRUE") else False

        new_shipping = Shipping(project_code=project_code, project_name=project_name, client_name=client_name, germany=germany, customer=customer, charges=charges, remarks=remarks, cancelled=cancelled, completed=completed)
        print("Added {}...".format(new_shipping))
        new_shipping.save()
        time.sleep(1)
      except Exception as e:
        missed.append({"row":i, "exception": e})

    for i in range(0, len(missed)):
      new_report = Report(title="Missing Shipping Entry", body="row:{i}, exception: {e}".format(i=str(missed[i]["row"]), e=str(missed[i]["exception"]), location='Importing page {sheet} from dev_script'.format(sheet=sheet)))
      print("saving new report {new_report}".format(new_report=new_report))
      new_report.save()

  elif(sheet == "PURCHASING"):
    purchases = db.worksheet(sheet)
    start_row = 5
    end_row = 243
    missed = []

    for j in range(start_row, end_row+1):
      try:
        active_row = purchases.row_values(j)

        purchase_order = active_row[0] if(active_row[0] != '') else 'null'
        project_code = active_row[5] if(active_row[5] != '') else 'null'
        po_date = resolveDate(active_row[1],"american") 
        if (j > 32):
          po_date = resolveDate(active_row[1])
        supplier_name = active_row[2]
        purchased_items = active_row[3]
        invoice_amount = active_row[4]
        expected_date = active_row[6] if (active_row[6] != '' or active_row[6] != None) else 'null' 
        supplier_date = active_row[7] if (active_row[7] != '' or active_row[7] != None) else 'null' 

        currency, value = resolveInvoiceAmount(invoice_amount)

        new_purchases = Purchases(purchase_order=purchase_order, project_code=project_code, po_date=po_date, supplier_name=supplier_name, purchased_items=purchased_items, currency=currency, value=value, expected_date=expected_date, supplier_date=supplier_date)
        new_purchases.save()
        print("Added {}...".format(new_purchases))
        time.sleep(1)
      except Exception as e:
        missed.append(j)

    for i in range(0, len(missed)):
      new_report = Report(title="Missing Purchasese Entry", body="row:{i}, exception: {e}".format(i=str(missed[i]["row"]), e=str(missed[i]["exception"])), location='Importing page {sheet} from dev_script'.format(sheet=sheet))
      print("saving new report {new_report}".format(new_report=new_report))
      new_report.save()
  

  elif(sheet == "AC RECEIVABLES"):
    purchases = db.worksheet(sheet)
    start_row = 5
    end_row = 58
    missed = []

    for i in range(start_row, end_row+1):
      try:
        active_row = purchases.row_values(i)

        sales_relation = active_row[0].replace(" ","-") if(active_row[0] != '') else 'null'
        invoice_number = active_row[9] if(active_row[9] != '') else 'null'
        invoice_date = resolveDate(active_row[8]) if (active_row != '') else '1950-01-01'
        status = active_row[10] if(active_row[10] != '') else 'null'
        completed = True if (active_row[11] == "TRUE") else False
        cancelled = True if (active_row[12] == "TRUE") else False

        print("=============")
        print(sales_relation)
        print("raw: {a} formatted: {b}".format(a=active_row[8], b=invoice_date))
        sale = Sales.objects.get(project_code=sales_relation)

        payment_status = PaymentStatus(sales_relation=sale, invoice_number=invoice_number, invoice_date=invoice_date, status=status, cancelled=cancelled, completed=completed)
        payment_status.save()
        print("Added {}...".format(payment_status))
        time.sleep(1)
      except Exception as e:
        missed.append({"row":i, "exception": e})

    for i in range(0, len(missed)):
      new_report = Report(title="Missing PaymentStatus Entry", body="row:{i}, exception: {e}".format(i=str(missed[i]["row"]), e=str(missed[i]["exception"])), location='Importing page {sheet} from dev_script'.format(sheet=sheet))
      print("saving new report {new_report}".format(new_report=new_report))
      new_report.save()


def resolveInvoiceAmount(invoice):
  if(invoice == '' or invoice == None):
    return None, None
  
  raw_invoice = invoice.strip()
  format_invoice = raw_invoice.split(" ")
  
  if(len(format_invoice) == 3):
    return resolveCurrency(format_invoice[0]), format_invoice[2].replace(",", "")

  return resolveCurrency(format_invoice[0]), format_invoice[1].replace(",", "")

def resolveDate(date,format="british"):
  pattern = re.compile('(0?[\d]{2})\/(0?[\d]{2})\/([\d]{4})')
  if(not pattern.match(date)):
    return "1950-01-01"
  if(date == "" or date == None):
    return "1950-01-01"
  if(date):
    raw_date = date.split("/")

    for i in range(0,len(raw_date)):
      if(len(raw_date[i]) == 1):
        raw_date[i] = "0"+raw_date[i]

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
# reset_migrations()

# print("===== Reading SALES =====")
# readSheet("SALES")

# print("===== Reading OPERATION =====")
# readSheet("OPERATION")

# print("===== Reading SHIPPING =====")
# readSheet("SHIPPING")

# print("===== Reading PURCHASES =====")
# readSheet("PURCHASING")

print("===== Reading ACCOUNTS =====")
readSheet("AC RECEIVABLES")