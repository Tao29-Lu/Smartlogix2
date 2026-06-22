# SmartLogix

## Descripción del proyecto

SmartLogix es una plataforma logística desarrollada bajo una arquitectura de microservicios. El sistema permite gestionar procesos relacionados con clientes, productos, pedidos y envíos, integrando un frontend web con distintos componentes backend mediante una API REST centralizada a través de un Backend For Frontend.

El proyecto fue desarrollado como parte de la asignatura Desarrollo Fullstack III, considerando la integración de componentes frontend y backend, persistencia de datos, pruebas unitarias y versionamiento en GitHub.

## Objetivo

El objetivo de SmartLogix es entregar una solución modular, mantenible y escalable para la gestión logística, separando las responsabilidades del sistema en distintos microservicios.

La solución permite:

* Visualizar productos disponibles.
* Validar stock antes de realizar una compra.
* Iniciar sesión como cliente.
* Crear pedidos.
* Gestionar envíos.
* Centralizar la comunicación entre frontend y backend mediante un BFF.
* Persistir datos utilizando MySQL y JPA.

## Arquitectura general

La arquitectura del proyecto está compuesta por:

```text
Frontend NPM/Vite
        ↓
BFF Service
        ↓
Microservicios Backend
        ↓
Base de datos MySQL
```

## Componentes principales

### Frontend

El frontend fue desarrollado con HTML, CSS y JavaScript, empaquetado como componente NPM utilizando Vite.

Ubicación:

```text
SmartLogix-main/
```

Puerto utilizado:

```text
5173
```

Tecnologías utilizadas:

* HTML5.
* CSS3.
* JavaScript.
* NPM.
* Vite.

Funciones principales:

* Visualización de la plataforma.
* Inicio de sesión.
* Listado de productos.
* Validación de stock.
* Creación de pedidos.
* Cierre de sesión.

### BFF Service

El Backend For Frontend actúa como intermediario entre el frontend y los microservicios internos. Su función es centralizar las solicitudes del frontend y redirigirlas al microservicio correspondiente.

Ubicación:

```text
backend/bff-service
```

Puerto utilizado:

```text
8080
```

Tecnologías utilizadas:

* Java 17.
* Spring Boot.
* Maven.
* API REST.
* RestTemplate.
* JUnit.
* JaCoCo.

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

Microservicio encargado de gestionar los productos disponibles, stock, descripción y precio.

Ubicación:

```text
backend/inventario-service
```

Puerto utilizado:

```text
8082
```

Base de datos:

```text
smartlogix_inventario
```

### pedidos-service

Microservicio encargado de gestionar los pedidos realizados por los clientes.

Ubicación:

```text
backend/pedidos-service
```

Puerto utilizado:

```text
8083
```

Base de datos:

```text
smartlogix_pedidos
```

### envio-service

Microservicio encargado de gestionar los envíos asociados a los pedidos.

Ubicación:

```text
backend/envio-service
```

Puerto utilizado:

```text
8081
```

Base de datos:

```text
smartlogix_envios
```

### cliente-service

Microservicio encargado de gestionar los clientes y el inicio de sesión.

Ubicación:

```text
backend/cliente-service
```

Puerto utilizado:

```text
8084
```

Base de datos:

```text
smartlogix_clientes
```

## Puertos utilizados

| Componente         | Puerto |
| ------------------ | -----: |
| Frontend NPM/Vite  |   5173 |
| BFF Service        |   8080 |
| envio-service      |   8081 |
| inventario-service |   8082 |
| pedidos-service    |   8083 |
| cliente-service    |   8084 |

## Persistencia de datos

La persistencia de datos se implementa utilizando MySQL, Spring Data JPA e Hibernate.

Cada microservicio cuenta con su propia configuración de base de datos mediante el archivo `application.properties`.

La estructura general de persistencia es:

```text
Microservicio → Repository → JPA/Hibernate → MySQL
```

Esta separación permite que cada microservicio administre sus propios datos, reduciendo el acoplamiento y mejorando la mantenibilidad del sistema.

## API REST

La comunicación entre frontend y backend se realiza mediante API REST.

El frontend consume los endpoints expuestos por el BFF:

```text
Frontend → BFF → Microservicios
```

Ejemplo:

```http
GET http://localhost:8080/api/productos
```

Este endpoint permite que el frontend obtenga productos desde el microservicio de inventario sin comunicarse directamente con él.

## Instalación y ejecución

### Requisitos previos

Antes de ejecutar el proyecto, se debe contar con:

* Java 17.
* Maven.
* Node.js.
* NPM.
* MySQL.
* Git.
* Visual Studio Code o IDE compatible.

## Ejecución del frontend

Desde la raíz del proyecto:

```bash
npm install
```

Luego ejecutar:

```bash
npm run dev
```

El frontend quedará disponible en:

```text
http://localhost:5173
```

## Ejecución del BFF

Entrar a la carpeta del BFF:

```bash
cd backend/bff-service
```

Ejecutar:

```bash
mvn spring-boot:run
```

El BFF quedará disponible en:

```text
http://localhost:8080
```

## Ejecución de microservicios

Cada microservicio debe ejecutarse desde su propia carpeta.

### envio-service

```bash
cd backend/envio-service
mvn spring-boot:run
```

Puerto:

```text
8081
```

### inventario-service

```bash
cd backend/inventario-service
mvn spring-boot:run
```

Puerto:

```text
8082
```

### pedidos-service

```bash
cd backend/pedidos-service
mvn spring-boot:run
```

Puerto:

```text
8083
```

### cliente-service

```bash
cd backend/cliente-service
mvn spring-boot:run
```

Puerto:

```text
8084
```

## Orden recomendado de ejecución

Para probar la integración completa se recomienda levantar los servicios en este orden:

```text
1. MySQL
2. inventario-service
3. cliente-service
4. pedidos-service
5. envio-service
6. bff-service
7. frontend
```

Para probar solamente la carga de productos desde el frontend, basta con ejecutar:

```text
inventario-service
bff-service
frontend
```

## Pruebas unitarias

El componente `bff-service` cuenta con pruebas unitarias implementadas utilizando JUnit, Spring Boot Test, MockMvc, Mockito y JaCoCo.

Para ejecutar las pruebas:

```bash
cd backend/bff-service
mvn clean verify
```

Resultado obtenido:

```text
Tests run: 14
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

Cobertura obtenida con JaCoCo:

```text
94%
```

Ubicación del reporte:

```text
backend/bff-service/target/site/jacoco/index.html
```

## Documentación del proyecto

La documentación se encuentra en la carpeta:

```text
documentacion/
```

Archivos incluidos:

```text
diagrama-arquitectura.md
persistencia-datos.md
informe-pruebas-unitarias.md
repositorios.txt
postman/SmartLogix.postman_collection.json
```

### Descripción de documentos

| Documento                          | Descripción                                                 |
| ---------------------------------- | ----------------------------------------------------------- |
| diagrama-arquitectura.md           | Explica la arquitectura de microservicios del proyecto.     |
| persistencia-datos.md              | Describe la persistencia con MySQL, JPA e Hibernate.        |
| informe-pruebas-unitarias.md       | Presenta pruebas unitarias, resultados y cobertura JaCoCo.  |
| repositorios.txt                   | Contiene enlaces y descripción de repositorios/componentes. |
| SmartLogix.postman_collection.json | Colección Postman para probar la API REST del BFF.          |

## Postman Collection

La colección Postman se encuentra en:

```text
documentacion/postman/SmartLogix.postman_collection.json
```

Incluye ejemplos de peticiones y respuestas para:

```http
GET  /api/productos
GET  /api/pedidos
GET  /api/envios
GET  /api/clientes
POST /api/clientes/login
POST /api/pedidos
POST /api/envios
```

## Patrones aplicados

En el proyecto se aplican los siguientes patrones y buenas prácticas:

* Arquitectura de microservicios.
* Backend For Frontend.
* Controller.
* Service Layer.
* Repository.
* API REST.
* Separación de responsabilidades.
* Persistencia por microservicio.
* Pruebas unitarias con cobertura.

## Versionamiento

El proyecto fue versionado utilizando Git y GitHub.

Repositorio principal:

```text
https://github.com/Tao29-Lu/Smartlogix2
```

Rama principal:

```text
main
```

## Conclusión

SmartLogix implementa una solución basada en microservicios, integrando un frontend NPM/Vite con un Backend For Frontend y microservicios desarrollados con Spring Boot y Maven.

La comunicación se realiza mediante API REST, la persistencia se gestiona con MySQL y JPA, y el componente BFF cuenta con pruebas unitarias exitosas y cobertura JaCoCo de 94%.

Esta estructura permite una solución modular, escalable y mantenible, alineada con los requerimientos del proyecto.
