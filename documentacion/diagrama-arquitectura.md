# Diagrama de Arquitectura de Microservicios - SmartLogix

## Descripción general

SmartLogix es una plataforma inteligente de logística diseñada para centralizar procesos de inventario, pedidos, envíos y clientes mediante una arquitectura basada en microservicios.

La solución integra un frontend empaquetado con NPM/Vite, un Backend For Frontend (BFF) y distintos microservicios backend desarrollados con Spring Boot y Maven. La comunicación entre los componentes se realiza mediante API REST y la persistencia de datos se gestiona con MySQL utilizando JPA/Hibernate.

## Diagrama de arquitectura

```text
+--------------------------------------------------+
|                  Usuario Final                   |
+--------------------------------------------------+
                         |
                         v
+--------------------------------------------------+
|        Frontend SmartLogix - NPM / Vite          |
|        Puerto: 5173                              |
|        HTML, CSS, JavaScript                     |
+--------------------------------------------------+
                         |
                         | API REST
                         v
+--------------------------------------------------+
|        BFF Service - Backend For Frontend        |
|        Puerto: 8080                              |
|        Spring Boot + WebClient                   |
+--------------------------------------------------+
        |                   |                  |                  |
        |                   |                  |                  |
        v                   v                  v                  v
+---------------+   +----------------+   +---------------+   +---------------+
| envio-service |   | inventario     |   | pedidos       |   | cliente       |
| Puerto: 8081  |   | service        |   | service       |   | service       |
| Spring Boot   |   | Puerto: 8082   |   | Puerto: 8083  |   | Puerto: 8084  |
| Maven         |   | Spring Boot    |   | Spring Boot   |   | Spring Boot   |
+---------------+   +----------------+   +---------------+   +---------------+
        |                   |                  |                  |
        v                   v                  v                  v
+---------------+   +----------------+   +---------------+   +---------------+
| MySQL         |   | MySQL          |   | MySQL         |   | MySQL         |
| smartlogix_   |   | smartlogix_    |   | smartlogix_   |   | smartlogix_   |
| envios        |   | inventario     |   | pedidos       |   | clientes      |
+---------------+   +----------------+   +---------------+   +---------------+
```

## Flujo de comunicación

El flujo principal de comunicación del sistema es el siguiente:

```text
Usuario → Frontend NPM/Vite → BFF Service → Microservicios → MySQL
```

El frontend no se comunica directamente con cada microservicio. En su lugar, envía las solicitudes al BFF, que actúa como intermediario y redirige las peticiones hacia el microservicio correspondiente.

## Componentes principales

### Frontend

El frontend permite al usuario interactuar con la plataforma SmartLogix. Fue estructurado como componente NPM utilizando Vite, permitiendo ejecutar el proyecto mediante scripts definidos en `package.json`.

Funciones principales:

- Visualización de la plataforma.
- Inicio de sesión de cliente.
- Listado de productos disponibles.
- Validación de stock.
- Creación de pedidos.
- Cierre de sesión.

### BFF Service

El Backend For Frontend actúa como punto central de comunicación entre el frontend y los microservicios. Su objetivo es evitar que la interfaz web dependa directamente de múltiples servicios backend.

Puerto utilizado:

```text
8080
```

Endpoints principales:

```http
GET  /api/productos
GET  /api/pedidos
GET  /api/envios
GET  /api/clientes
POST /api/clientes/login
POST /api/pedidos
POST /api/envios
```

### inventario-service

Microservicio encargado de gestionar los productos disponibles, su stock, descripción y precio.

Puerto utilizado:

```text
8082
```

Base de datos asociada:

```text
smartlogix_inventario
```

### pedidos-service

Microservicio encargado de gestionar los pedidos realizados por los clientes.

Puerto utilizado:

```text
8083
```

Base de datos asociada:

```text
smartlogix_pedidos
```

### envio-service

Microservicio encargado de gestionar los envíos y estados de despacho.

Puerto utilizado:

```text
8081
```

Base de datos asociada:

```text
smartlogix_envios
```

### cliente-service

Microservicio encargado de gestionar clientes e inicio de sesión.

Puerto utilizado:

```text
8084
```

Base de datos asociada:

```text
smartlogix_clientes
```

## Persistencia de datos

Cada microservicio posee su propia configuración de conexión a MySQL mediante `application.properties`. La persistencia se realiza utilizando Spring Data JPA e Hibernate, permitiendo mapear entidades Java hacia tablas relacionales.

Esto permite separar los datos por dominio funcional, reduciendo el acoplamiento entre servicios y facilitando el mantenimiento del sistema.

## Justificación de la arquitectura

Se utiliza arquitectura de microservicios porque permite dividir el sistema en componentes independientes, cada uno responsable de una funcionalidad específica.

Esta división permite:

- Separar responsabilidades.
- Mejorar la mantenibilidad.
- Facilitar la escalabilidad.
- Permitir que cada microservicio tenga su propia persistencia.
- Centralizar la comunicación del frontend mediante un BFF.
- Reducir el acoplamiento entre la interfaz web y los servicios backend.

## Conclusión

La arquitectura implementada en SmartLogix integra frontend, BFF, microservicios backend, API REST y persistencia con MySQL. Esta estructura responde a la necesidad del cliente de contar con una plataforma logística escalable, organizada y mantenible.