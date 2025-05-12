from app.db import logyser
import json
#from .db import logyser as lg

def stock_logyser():

    tabla = logyser.consulta_stock()
    tabla.encoding = 'utf-8-sig'
    datta = json.loads(tabla.text)
    productos = []
    for i in datta:
        productos.append({'codigo':i['idproducto']})

    mapa = {
        dato['idproducto']: dato  # aquí la variable interna es 'dato'
        for dato in datta
    }
    for registro in productos:
        codigo = registro['codigo']
        if codigo in mapa:
            info = mapa[codigo]
            registro[info['estado']] = int(info['cantidad'])
    
    return datta

def agregar_stock(ks):
    tab = stock_logyser()
    indice = {item['codigo']: item for item in tab}
    for i in ks:
        codigo = i['codigo']
        resultado = indice.get(codigo, None)
        i['DISPONIBLE'] = 0
        i['CUARENTENA'] = 0
        if resultado:
            if 'DISPONIBLE' in resultado:
                i['DISPONIBLE'] = resultado['DISPONIBLE']
            elif 'CUARENTENA' in resultado:
                i['CUARENTENA'] = resultado['CUARENTENA']
    
    return ks

