# Restaurante

## Cómo ejecutar el backend

Hay que arrancar Postgres y la API de Spring Boot.

En el directorio `backend/`, ejecutar `docker compose up -d` (solo hace falta una vez, después queda andando). Luego ejecutar `./mvnw spring-boot:run`. El backend se ejecuta en el puerto 8080.

---

## Endpoints de la API

### Autenticación e Información de Usuario

#### **POST `/api/auth/login`**
* **Descripción**: Inicia sesión.
* **Auth**: Anónimo.
* **Input**:
  ```json
  { "email": "string", "password": "string" }
  ```
* **Output**:
  ```json
  {
    "token": { "value": "string", "expiryDate": "ISO8601" },
    "user": { "userId": 0, "roles": ["MOZO", "CLIENTE", "..."] }
  }
  ```

#### **POST `/api/auth/signup`**
* **Descripción**: Registro de nuevo cliente.
* **Auth**: Anónimo.
* **Input (Multipart)**:
  * `clienteDto`:
    ```json
    {
      "nombre": "string", "apellido": "string", "email": "string",
      "fechaNacimiento": "YYYY-MM-DD", "password": "string", "passwordConfirm": "string"
    }
    ```
  * `imageFile`: Archivo de imagen (opcional).
* **Output**: Mismo que `login`.

#### **GET `/api/auth/me`**
* **Descripción**: Obtiene ID y roles del usuario actual.
* **Auth**: Autenticado.
* **Output**:
  ```json
  { "userId": 0, "roles": ["..."] }
  ```

#### **GET `/api/profile`**
* **Descripción**: Obtiene el perfil completo del usuario autenticado.
* **Auth**: Autenticado.
* **Output**:
  ```json
  {
    "userId": 0, "personaId": 0, "nombre": "string", "apellido": "string",
    "fechaNacimiento": "YYYY-MM-DD", "email": "string", "imageUrl": "string", "rol": "..."
  }
  ```

---

### Carta

#### **GET `/api/carta`**
* **Descripción**: Carta vigente para clientes. Tiene en cuenta el stock.
* **Auth**: Público.
* **Output**:
  ```json
  {
    "id": 0,
    "secciones": [{
      "id": 0, "nombre": "string",
      "items": [{ "id": 0, "nombre": "string", "descripcion": "string", "precio": 0.0, "imageUrl": "string" }]
    }]
  }
  ```

#### **GET `/api/mozos/carta`**
* **Descripción**: Carta vigente para mozos. En el cálculo de stock, tiene en cuenta las comandas abierta, aún no envíadas a la cocina.
* **Auth**: Rol `MOZO`.
* **Output**: Mismo que `/api/carta`.

---

### Mesas

#### **GET `/api/mesas`**
* **Descripción**: Lista de mesas.
* **Auth**: Rol `MOZO`.
* **Output**:
  ```json
  [{ "id": 0, "numero": 0, "estado": "LIBRE|OCUPADA|...", "capacidad": 0, "zona": "string" }]
  ```

#### **GET `/api/mesas/{mesaId}`**
* **Descripción**: Detalle de una mesa y sus comandas.
* **Auth**: Rol `MOZO`.
* **Output**:
  ```json
  {
    "id": 0, "numero": 0, "estado": "...", "capacidad": 0, "zona": "string",
    "comandas": [{ "id": 0, "fechaSolicitud": "YYYY-MM-DD", "estado": "..." }]
  }
  ```

---

### Comandas

#### **GET `/api/comandas/{comandaId}`**
* **Descripción**: Detalle de una comanda.
* **Auth**: Rol `MOZO`.
* **Output**:
  ```json
  {
    "id": 0, "fechaSolicitud": "YYYY-MM-DD", "estado": "EN_PROCESO_DE_SOLICITUD|...",
    "detalles": [{
      "id": 0, "estado": "...",
      "itemCarta": { "id": 0, "nombre": "string", "precio": 0.0, "..." }
    }]
  }
  ```

#### **POST `/api/comandas`**
* **Descripción**: Crea una nueva comanda para una mesa.
* **Auth**: Rol `MOZO`.
* **Input**: `{ "mesaId": 0 }`
* **Output**: Mismo que `GET /api/comandas/{id}`.

#### **POST `/api/comandas/{id}/enviar-a-cocina`**
* **Descripción**: Cambia el estado de la comanda y sus items a "enviado a cocina".
* **Auth**: Rol `MOZO`.

#### **POST `/api/comandas/{id}/marcar-entregada`**
* **Descripción**: Marca la comanda como entregada.
* **Auth**: Rol `MOZO`.

#### **POST `/api/comandas/{id}/detalles`**
* **Descripción**: Agrega un item de la carta a la comanda.
* **Auth**: Rol `MOZO`.
* **Input**: `{ "itemCartaId": 0 }`

#### **POST `/api/comandas/{id}/detalles/{detalleId}/marcar-entregado`**
* **Descripción**: Marca un item específico como entregado.
* **Auth**: Rol `MOZO`.

#### **DELETE `/api/comandas/{id}/detalles/{detalleId}`**
* **Descripción**: Quita un item de la comanda.
* **Auth**: Rol `MOZO`.

---

### Reseñas

#### **GET `/api/resenias`**
* **Descripción**: Lista de todas las reseñas.
* **Auth**: Público.
* **Output**:
  ```json
  [{
    "id": 0, "observacion": "string", "fecha": "YYYY-MM-DD",
    "cliente": { "nombre": "string", "imageUrl": "string", "..." }
  }]
  ```

#### **POST `/api/resenias`**
* **Descripción**: Crea una reseña (el cliente se toma del token).
* **Auth**: Rol `CLIENTE`.
* **Input**: `{ "observacion": "string" }`

---

### Pagos

#### **POST `/api/payments`**
* **Descripción**: Genera un link de pago de Mercado Pago para una o más comandas.
* **Auth**: Autenticado.
* **Input**:
  ```json
  { "idsComandas": [0] }
  ```
* **Output**:
  ```json
  { "urlDePago": "string" }
  ```

---

### Imágenes

#### **GET `/api/items-carta/{id}/imagen`**
* **Descripción**: Obtiene la imagen de un item de la carta.
* **Auth**: Público.
* **Output**: Archivo binario (image/jpeg, etc).

#### **GET `/api/personas/{id}/imagen`**
* **Descripción**: Obtiene la imagen de perfil de una persona.
* **Auth**: Público.
* **Output**: Archivo binario.
