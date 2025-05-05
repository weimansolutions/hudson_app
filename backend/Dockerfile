FROM python:3.12-slim

# Instala dependencias del sistema y resuelve conflictos ODBC
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    curl gnupg apt-transport-https unixodbc unixodbc-dev \
 && apt-get remove -y libodbc2 libodbcinst2 odbcinst1debian2 unixodbc-common \
 && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/11/prod.list \
       > /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
       msodbcsql17 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia sólo requirements e instala (para cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Variables de entorno por defecto (puedes sobreescribirlas en docker-compose)
ENV DATABASE_URL=postgresql://sa:ZcdcuIMgzdD3vnO58UW3h0Ra0UpSjfaE@dpg-cmcrgdn109ks7392qm4g-a.oregon-postgres.render.com/capibara_db
ENV SECRET_KEY=your_secret_key

# Expone el puerto de Uvicorn
EXPOSE 8000

# Comando por defecto
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]