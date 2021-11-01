from sales_app.models import Sales
from ms_app.models import *
import os
import gspread

gc = gspread.service_account(filename=os.path.join(os.getcwd(),'ms_app/google_dlk_key.json'))

# Acces Google Sheet "DLK_MASTERSCHEDULE_11_1_2021"
db = gc.open_by_key("11YmOa5p7BuKbOOzzts9_o4ssghzrxUaT6RBm0YzqnPA")

sales = db.worksheet("SALES")

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


def resolveInvoiceAmount(invoice):
  raw_invoice = invoice.strip()
  format_invoice = raw_invoice.split(" ")

  if(len(format_invoice) == 3):
    return resolveCurrency(format_invoice[0]), format_invoice[2].replace(",", "")

  return resolveCurrency(format_invoice[0]), format_invoice[1].replace(",", "")

def resolveDate(date):
  date_unbound = date.split("/")

  if(len(date_unbound[0]) == 1):
    date_unbound[0] = "0"+date_unbound[0]

  new_date = [date_unbound[2],"-",date_unbound[0],"-", date_unbound[1]]
  return "".join(new_date)

# Read and Store Sales with gSpread
for i in range(start_row, end_row):
  project_code = sales.cell(i,1).value
  project_name = sales.cell(i,2).value
  client_name = sales.cell(i,3).value
  project_detail = sales.cell(i,4).value
  invoice_amount = sales.cell(i,5).value
  currency, value = resolveInvoiceAmount(invoice_amount)
  order_date = resolveDate(sales.cell(i,6).value)
  shipping_date = resolveDate(sales.cell(i,6).value)
  payment_term = sales.cell(i,6).value
  
  new_sale = Sales(project_code=project_code, project_name=project_name, client_name=client_name, project_detail=project_detail, value=value, currency=currency, order_date=order_date, shipping_date=shipping_date, payment_term=payment_term)

  print("Adding {}...".format(new_sale))
  new_sale.save()