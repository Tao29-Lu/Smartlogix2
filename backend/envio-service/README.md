# Microservicio de Envíos

Este microservicio forma parte del sistema backend y se encarga de gestionar los envíos asociados a pedidos.

## Tecnologías utilizadas

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database
- Maven
- Lombok
- Thunder Client para pruebas

## Arquitectura

El microservicio utiliza arquitectura en capas:

- Controller: expone los endpoints REST.
- Service: contiene la lógica de negocio.
- Repository: gestiona el acceso a datos.
- Model: representa las entidades del sistema.

## Puerto

El microservicio se ejecuta en:

http://localhost:8083

## Base de datos

Se utiliza H2 en memoria:

jdbc:h2:mem:envios_db

Consola H2:

http://localhost:8083/h2-console

## Endpoints

### Crear envío

POST /api/envios

Body:

```json
{
  "pedidoId": 1,
  "destinatario": "Lucero Gutierrez",
  "direccion": "Av. Siempre Viva 123",
  "comuna": "Santiago",
  "ciudad": "Santiago"
}
