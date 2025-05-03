import json

def test_create_and_read_client(client):
    # 1) Crear un cliente
    data = {
        "name": "Acme Corp",
        "address": "Calle Falsa 123",
        "contact_email": "info@acme.com"
    }
    response = client.post("/api/v1/water/clients/", json=data)
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Acme Corp"
    assert "id" in body

    client_id = body["id"]

    # 2) Leer el cliente
    response2 = client.get(f"/api/v1/water/clients/{client_id}")
    assert response2.status_code == 200
    body2 = response2.json()
    assert body2["id"] == client_id
    assert body2["contact_email"] == "info@acme.com"

def test_list_empty_clients(client):
    # Si la memoria acaba de crearse, debería haber al menos el cliente anterior
    response = client.get("/api/v1/water/clients/")
    assert response.status_code == 200
    lst = response.json()
    assert isinstance(lst, list)
    assert len(lst) >= 1
