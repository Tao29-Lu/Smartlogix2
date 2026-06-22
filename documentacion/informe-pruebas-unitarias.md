# Informe de Pruebas Unitarias - SmartLogix

## Descripción general

Este informe documenta las pruebas unitarias realizadas sobre los componentes backend del sistema SmartLogix. El objetivo principal es validar el correcto funcionamiento de los microservicios, controladores, servicios y componentes principales de la arquitectura.

SmartLogix utiliza una arquitectura basada en microservicios, integrada mediante un Backend For Frontend (BFF), API REST y persistencia de datos con MySQL, JPA e Hibernate.

## Objetivo de las pruebas

El objetivo de las pruebas unitarias es asegurar que cada componente funcione correctamente de forma individual antes de integrarse con el resto del sistema.

Las pruebas permiten validar:

* Carga correcta del contexto de Spring Boot.
* Funcionamiento de controladores REST.
* Funcionamiento de servicios internos.
* Comunicación entre el BFF y los microservicios.
* Respuestas esperadas de los endpoints.
* Calidad y mantenibilidad del código.
* Generación de métricas de cobertura mediante JaCoCo.

## Componentes evaluados

Los componentes considerados para pruebas son:

```text
bff-service
inventario-service
pedidos-service
envio-service
cliente-service
```

En esta etapa se implementaron y ejecutaron pruebas unitarias en el componente `bff-service`, debido a que este servicio centraliza la comunicación entre el frontend y los microservicios internos.

## Herramientas utilizadas

Para la implementación y ejecución de pruebas se utilizaron las siguientes herramientas:

* JUnit 5.
* Spring Boot Test.
* MockMvc.
* Mockito.
* Maven.
* JaCoCo.

## Tipos de pruebas implementadas

### 1. Pruebas de carga de contexto

Estas pruebas validan que el componente pueda iniciar correctamente el contexto de Spring Boot.

Ejemplo:

```java
@Test
void contextLoads() {
}
```

Este tipo de prueba permite detectar errores de configuración, problemas con dependencias, errores en `application.properties` o fallas en la inicialización de beans.

### 2. Pruebas de controladores REST

Estas pruebas validan que los endpoints del BFF respondan correctamente ante solicitudes HTTP.

Endpoints considerados:

```http
GET  /api/productos
GET  /api/pedidos
GET  /api/envios
GET  /api/clientes
POST /api/clientes/login
POST /api/pedidos
POST /api/envios
```

### 3. Pruebas de servicios

Estas pruebas validan la lógica interna del componente BFF, específicamente la redirección de solicitudes hacia los microservicios internos.

Funciones consideradas:

* Obtener productos.
* Obtener pedidos.
* Obtener envíos.
* Obtener clientes.
* Crear pedidos.
* Crear envíos.
* Realizar login de cliente.

## Configuración de JaCoCo

Para generar métricas de cobertura se agregó el plugin JaCoCo al archivo `pom.xml` del componente `bff-service`.

Configuración utilizada:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.12</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

## Comandos utilizados

Para ejecutar las pruebas unitarias se utilizó el siguiente comando:

```bash
mvn clean test
```

Para ejecutar las pruebas y generar el reporte de cobertura con JaCoCo se utilizó:

```bash
mvn clean verify
```

## Ubicación del reporte de cobertura

El reporte HTML generado por JaCoCo queda disponible en la siguiente ruta:

```text
backend/bff-service/target/site/jacoco/index.html
```

## Resultado obtenido en bff-service

Se ejecutaron las pruebas unitarias del componente `bff-service` mediante Maven y JaCoCo.

Comando utilizado:

```bash
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

El reporte de cobertura fue generado correctamente en:

```text
backend/bff-service/target/site/jacoco/index.html
```

La cobertura total obtenida en el componente `bff-service` fue de:

```text
94%
```

Detalle de cobertura obtenido desde JaCoCo:

| Paquete                       | Cobertura |
| ----------------------------- | --------: |
| com.smartlogix.bff.controller |       86% |
| com.smartlogix.bff            |       37% |
| com.smartlogix.bff.service    |      100% |
| Total bff-service             |       94% |

Este resultado evidencia que el BFF cuenta con pruebas unitarias exitosas y una cobertura superior al 60% solicitado en la evaluación.

## Tabla de resultados

| Componente         | Pruebas consideradas          | Estado                  | Resultado                                                    |
| ------------------ | ----------------------------- | ----------------------- | ------------------------------------------------------------ |
| bff-service        | Contexto, Controller, Service | Ejecutado correctamente | 14 tests exitosos, 0 errores, 0 fallos, cobertura JaCoCo 94% |
| inventario-service | Contexto, Controller, Service | Pendiente de ejecutar   | Por implementar                                              |
| pedidos-service    | Contexto, Controller, Service | Pendiente de ejecutar   | Por implementar                                              |
| envio-service      | Contexto, Controller, Service | Pendiente de ejecutar   | Por implementar                                              |
| cliente-service    | Contexto, Controller, Service | Pendiente de ejecutar   | Por implementar                                              |

## Ejemplos de pruebas implementadas

### Prueba de carga de contexto

```java
@SpringBootTest
class BffServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

Esta prueba valida que la aplicación `bff-service` pueda iniciar correctamente el contexto de Spring Boot.

### Prueba de controlador con MockMvc

```java
@WebMvcTest(BffController.class)
class BffControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BffService bffService;

    @Test
    void obtenerProductosDebeResponderOk() throws Exception {
        Mockito.when(bffService.obtenerProductos())
                .thenReturn("[{\"id\":1,\"nombre\":\"Teclado Mecánico\",\"stock\":20,\"precio\":39990.0}]");

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
```

Esta prueba valida que el endpoint `GET /api/productos` responda correctamente desde el BFF.

### Prueba de creación de pedido

```java
@Test
void crearPedidoDebeResponderOk() throws Exception {
    Mockito.when(bffService.crearPedido(anyString()))
            .thenReturn("{\"id\":1,\"estado\":\"PENDIENTE\"}");

    mockMvc.perform(post("/api/pedidos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"producto\":\"Teclado Mecánico\",\"cantidad\":1,\"total\":39990}"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
}
```

Esta prueba valida que el endpoint `POST /api/pedidos` pueda recibir una solicitud HTTP y responder correctamente.

### Prueba de login de cliente

```java
@Test
void loginClienteDebeResponderOk() throws Exception {
    Mockito.when(bffService.loginCliente(anyString()))
            .thenReturn("{\"autenticado\":true,\"nombre\":\"Cliente Demo\"}");

    mockMvc.perform(post("/api/clientes/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"demo@smartlogix.cl\",\"password\":\"1234\"}"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
}
```

Esta prueba valida que el endpoint `POST /api/clientes/login` responda correctamente ante una solicitud de inicio de sesión.

### Prueba de servicio con RestTemplate simulado

```java
@Test
void obtenerProductosDebeRetornarJson() {
    String respuestaEsperada = "[{\"id\":1,\"nombre\":\"Teclado Mecánico\"}]";

    mockServer.expect(requestTo("http://localhost:8082/productos"))
            .andExpect(method(GET))
            .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

    String respuesta = bffService.obtenerProductos();

    assertEquals(respuestaEsperada, respuesta);
    mockServer.verify();
}
```

Esta prueba valida que el servicio BFF pueda consultar correctamente el microservicio de inventario y retornar la respuesta esperada.

## Relación con patrones de diseño

Las pruebas unitarias permiten validar que los patrones aplicados funcionen correctamente.

Patrones aplicados en el proyecto:

* Controller.
* Service Layer.
* Repository.
* Backend For Frontend.
* API REST.
* Separación de responsabilidades.

Estos patrones mejoran la mantenibilidad porque separan responsabilidades y permiten probar cada parte del sistema de forma más clara.

## Importancia del BFF en las pruebas

El `bff-service` es un componente clave dentro de la arquitectura SmartLogix, ya que centraliza la comunicación entre el frontend y los microservicios internos.

El flujo validado es:

```text
Frontend NPM/Vite → BFF Service → Microservicios → MySQL
```

Al probar el BFF, se valida que los endpoints principales expuestos al frontend estén correctamente definidos y puedan responder según lo esperado.

## Evidencias recomendadas

Para respaldar este informe, se recomienda incluir capturas de:

* Ejecución del comando `mvn clean verify`.
* Resultado `BUILD SUCCESS`.
* Resultado `Tests run: 14, Failures: 0, Errors: 0, Skipped: 0`.
* Reporte JaCoCo con cobertura total de 94%.
* Carpeta `target/site/jacoco`.
* Archivo `index.html` del reporte JaCoCo.
* Pruebas creadas en `BffControllerTest.java`.
* Pruebas creadas en `BffServiceTest.java`.
* Prueba de contexto en `BffServiceApplicationTests.java`.

## Conclusión

Las pruebas unitarias permiten asegurar la calidad del sistema SmartLogix, validando el correcto funcionamiento de sus componentes principales.

En esta etapa se implementaron pruebas unitarias para el componente `bff-service`, obteniendo un resultado exitoso de 14 pruebas ejecutadas, sin errores ni fallos. Además, se configuró JaCoCo para generar un reporte de cobertura en formato HTML.

La cobertura total obtenida fue de 94%, superando el mínimo del 60% solicitado en la evaluación. Esto entrega evidencia técnica sobre la estabilidad del BFF, componente central de la arquitectura de microservicios, y permite avanzar hacia el cumplimiento del requisito de pruebas unitarias y métricas claras solicitado para el proyecto.
