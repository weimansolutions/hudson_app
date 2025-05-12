import requests, os
from dotenv import load_dotenv
load_dotenv()

LOGYSER_CLIENT = os.getenv("LOGYSER_CLIENT")
LOGYSER_APIKEY = os.getenv("LOGYSER_APIKEY")


def consulta_stock():
  url = "https://apis.logyser.com.ar/getstockgimsa"

  payload = {}
  headers = {
    'client': LOGYSER_CLIENT,
    'apikey': LOGYSER_APIKEY
  }

  
  response = requests.request("GET", url, headers=headers, data=payload)
  
  return response