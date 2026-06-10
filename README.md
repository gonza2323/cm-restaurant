# Restaurante


## Como ejecutar el backend

Hay que arrancar Postgres y la API de Spring Boot.

En el directorio `backend/`, ejecutar `sudo docker compose up -d`. Hay que tener el motor de docker instalado. Esto una sola vez hace falta. Después ejecutar `./mvnw spring-boot:run`. El backend se ejecuta en el puerto 8080.


## Endpoints disponibles

Ver los DTOs en el back para saber con más detalle que requiere y que devuelve cada endpoint.


### Autenticación

* **POST `/api/auth/login`**: Inicia sesión.
  * **Input**: `username`, `password`
  * **Output**: Token de acceso y ID del usuario.

* **POST `/api/auth/signup`**: Registra un nuevo usuario.
  * **Input**: `username`, `password`, `passwordConfirm`, archivo multipart con la foto del usuario.
  * **Output**: Token de acceso y ID del usuario.

* **GET `/api/auth/me`**: Verifica el estado de la sesión.
  * **Output**: ID y roles del usuario autenticado.


### Carta

* **GET `/api/carta`**: Devuelve la carta vigente
  * **Output**: La carta vigente con sus secciones, y en cada una, cada item de la carta, con sus datos y url de la imagen.


### Mesas

* **GET `/api/mesas`**: Devuelve la lista de mesas y sus datos
  * **Output**: Lista de mesas con su id, número, capacidad, estado, zona.

* **GET `/api/mesas/{mesaId}`**: Devuelve una mesa con sus datos y la lista de comandas de esa mesa

A partir de acá no está implementado

### Comandas

* **GET `/api/comandas/{comandaId}`**: Devuelve los datos de una comanda, incluyendo cada plato agregado.