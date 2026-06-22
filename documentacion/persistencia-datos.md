# Descripción de Persistencia de Datos - SmartLogix

## Descripción general

La persistencia de datos en SmartLogix se implementa utilizando MySQL como motor de base de datos relacional. Cada microservicio cuenta con su propia configuración de conexión, lo que permite separar la información según el dominio funcional del sistema.

La comunicación entre los microservicios y la base de datos se realiza mediante Spring Data JPA e Hibernate.

Esta documentación responde al requerimiento de la Evaluación Parcial N°3, donde se solicita explicar cómo se garantiza la persistencia de datos en la arquitectura de microservicios. :contentReference[oaicite:0]{index=0}

## Tecnologías utilizadas

- MySQL
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- JDBC Driver para MySQL

## Configuración general de persistencia

Cada microservicio posee un archivo `application.properties`, donde se define:

- Nombre de la aplicación.
- Puerto del servicio.
- URL de conexión a MySQL.
- Usuario de base de datos.
- Contraseña.
- Driver JDBC.
- Configuración de JPA/Hibernate.

Ejemplo de configuración utilizada:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartlogix_inventario?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Santiago
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## Bases de datos utilizadas

El proyecto utiliza bases de datos separadas por microservicio:

```text
smartlogix_envios
smartlogix_inventario
smartlogix_pedidos
smartlogix_clientes
```

Esta separación permite que cada microservicio administre sus propios datos, evitando que todos dependan de una única estructura centralizada.

## Persistencia por microservicio

### inventario-service

Este microservicio gestiona la información de productos disponibles en la plataforma.

Datos persistidos:

- ID del producto.
- Nombre del producto.
- Descripción.
- Stock disponible.
- Precio.

Base de datos asociada:

```text
smartlogix_inventario
```

Puerto del servicio:

```text
8082
```

### pedidos-service

Este microservicio gestiona los pedidos realizados por los clientes.

Datos persistidos:

- ID del pedido.
- Cliente asociado.
- Producto solicitado.
- Cantidad.
- Total.
- Estado del pedido.
- Fecha del pedido.

Base de datos asociada:

```text
smartlogix_pedidos
```

Puerto del servicio:

```text
8083
```

### envio-service

Este microservicio gestiona la información relacionada con los envíos.

Datos persistidos:

- ID del envío.
- Pedido asociado.
- Dirección de despacho.
- Estado del envío.
- Transportista.

Base de datos asociada:

```text
smartlogix_envios
```

Puerto del servicio:

```text
8081
```

### cliente-service

Este microservicio gestiona los clientes y el inicio de sesión.

Datos persistidos:

- ID del cliente.
- Nombre.
- Correo electrónico.
- Credenciales de acceso.
- Datos asociados al inicio de sesión.

Base de datos asociada:

```text
smartlogix_clientes
```

Puerto del servicio:

```text
8084
```

## Uso de JPA e Hibernate

JPA permite mapear clases Java como entidades persistentes mediante anotaciones. Hibernate actúa como implementación de JPA y se encarga de sincronizar las entidades con las tablas de la base de datos.

Anotaciones utilizadas comúnmente:

```java
@Entity
@Id
@GeneratedValue
```

Ejemplo de entidad:

```java
@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private Integer stock;
    private Double precio;
}
```

## Uso de repositorios

Los repositorios permiten acceder a la base de datos sin escribir SQL manual para operaciones CRUD básicas.

Ejemplo:

```java
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
```

Con `JpaRepository` se pueden realizar operaciones como:

- Guardar registros.
- Buscar por ID.
- Listar todos los registros.
- Actualizar información.
- Eliminar registros.

## Configuración `ddl-auto=update`

La propiedad:

```properties
spring.jpa.hibernate.ddl-auto=update
```

permite que Hibernate actualice automáticamente la estructura de las tablas según las entidades del proyecto.

Esto facilita el desarrollo, ya que permite crear o modificar tablas durante la ejecución del microservicio sin escribir manualmente todos los scripts SQL.

## Relación con la API REST

La persistencia se conecta con la API REST de la siguiente manera:

```text
Frontend → BFF → Microservicio → Repository → MySQL
```

Ejemplo en inventario:

```text
Frontend solicita productos
        ↓
BFF recibe GET /api/productos
        ↓
BFF consulta inventario-service
        ↓
inventario-service consulta ProductoRepository
        ↓
ProductoRepository obtiene datos desde MySQL
        ↓
La respuesta vuelve al frontend en formato JSON
```

## Ventajas de la persistencia implementada

- Separación de datos por microservicio.
- Mayor organización del sistema.
- Persistencia real mediante MySQL.
- Uso de JPA para reducir código repetitivo.
- Facilidad para mantener y escalar cada componente.
- Menor acoplamiento entre servicios.
- Cada microservicio puede evolucionar de forma independiente.

## Conclusión

La persistencia de SmartLogix se garantiza mediante MySQL, Spring Data JPA e Hibernate. Cada microservicio administra sus propios datos mediante entidades, repositorios y configuración independiente en `application.properties`.

Esta estructura permite una solución modular, escalable y alineada con la arquitectura de microservicios solicitada para el proyecto.