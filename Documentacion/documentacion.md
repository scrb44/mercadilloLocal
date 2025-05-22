# 1. Introducción del Proyecto

## Mercadillo Local

### ODS 11: Ciudades y comunidades sostenibles

## Problema detectado:

Debido al aumento del aislamiento, la desaparición de espacios de encuentro comunitario y el sedentarismo, muchas personas cada vez están menos informadas sobre los negocios o eventos que ocurren en su propia ciudad o comunidad. Esto incluye también la falta de conocimiento sobre productos y servicios accesibles y de origen local.

## Objetivo de la aplicación:

Ante esta problemática y en línea con el Objetivo de Desarrollo Sostenible relacionado con ciudades y comunidades sostenibles, buscamos desarrollar una solución digital que sirva como puente entre los negocios locales y los habitantes de la comunidad. A través de esta plataforma, los ciudadanos podrán conocer los comercios cercanos, así como dónde y cómo adquirir sus bienes y servicios.

Por el momento, la aplicación se centra exclusivamente en la ciudad de Málaga y sus alrededores.

# 2. Usuarios y casos de uso

## Tipo de usuarios:

-   Compradores: ciudadanos y habitantes de la localidad en cuestion, dado el alcanse actual del proyecto la ciudad de malaga (publico general)

    los compradores podrian acceder a la pagina para ver los productos, se podran registrar explorar los productos y agregarlos a un carrito de compra, asi como calificar reportar o comentar estos mismos productos

-   Vendedores: comerciantes locales que vendan _productos_ con posibilidad de expandir a aquillos que vendan cervicios por ejemplo:

    -   pastelerias
    -   bares que hagan su propio vino
    -   tiendas de ropa
    -   maqueteria
    -   libros
    -   ropa segunda mano
    -   etc.

    los vendedores podrian acceder a su perfil para ver el estado de su pagina sus baneers y los productos agregados, de momento nosotros ofreseriamos el servicio de actualizar o agregar los productos a la pagina, mas no se descarta agregar la opcion que el propio vendedor lo pueda agregar, asi como la accion de participar en eventos

-   Administradores: nosotros como dueños de la pagina o algun empleado que funga de regulador

    los administradores tendriamos la capacidad de administrar los productos, regular a los usuarios tanto clientes como compradores en su actitud o si llegan a ser reportados asi como de agregar eventos.

## Historias de usuario

### Historia de Usuario 1: Visualizar productos de diferentes lugares y categorías
Como usuario comprador,
 Quiero poder ver una lista de productos agrupados por categorías y de diferentes localidades,
 Para que pueda fácilmente encontrar lo que busco y ver opciones de distintas áreas.

### Historia de Usuario 2: Filtrar productos por categorías, ubicación y precio
Como usuario comprador,
 Quiero filtrar los productos por categorías (ejemplo: ropa, comida, herramientas) y por ubicación,
 Para que pueda reducir la búsqueda y encontrar productos de interés más rápido.

### Historia de Usuario 3: Ver los detalles de un producto
Como usuario comprador,
 Quiero poder ver los detalles de un producto (descripción, precio, ubicación del vendedor, fotos),
 Para que pueda tomar una decisión informada antes de realizar la compra.

### Historia de Usuario 4: Agregar productos al carrito
Como usuario comprador,
 Quiero agregar productos a mi carrito,
 Para que pueda revisar y comprar varios productos en un solo proceso de pago.

### Historia de Usuario 5: Crear un perfil de vendedor
Como vendedor local,
 Quiero poder crear un perfil en la página donde pueda subir productos de mi tienda,
 Para que los compradores puedan ver mis productos y contactar conmigo.

 ### Historia de Usuario 6: Gestión de productos para el vendedor
Como vendedor,
 Quiero poder gestionar los productos que subo a la página (editar, eliminar, actualizar precios),
 Para que pueda mantener mi catálogo actualizado de manera sencilla.

### Historia de Usuario 7: Sistema de reseñas y valoraciones
Como usuario comprador,
 Quiero poder dejar una reseña y valoración a los productos que he comprado,
 Para que otros compradores puedan ver mi experiencia y tomar decisiones más informadas.




## Casos de uso detallados (diagramas opcionales)

Rellenar

# 3. Arquitectura de la aplicación

## Diagrama de alto nivel (Frontend, Backend, Base de datos, etc.)

Rellenar

## Tecnologías a utilizar

-   HTML
-   CSS
-   React
-   TypeScript
-   SpringBoot
-   MySQL

## Estructura de carpetas propuesta para frontend y backend

Rellenar

# 4. Diseño del Frontend

## Wireframes o mockups (Figma, Excalidraw o incluso papel escaneado)

Rellenar

## Flujo de navegación entre pantallas

Rellenar

## Principales componentes React

Rellenar

## Diseño responsive y estilo (breve guía de estilos si aplica)

Rellenar

# 5. Diseño del Backend

## Modelo entidad-relación (MER)

Rellenar

## Diagrama de clases (opcional)

Rellenar

## Endpoints de la API REST

### GET /productos/categorias/{categoriaId}: Obtiene los productos de una categoría.

### GET /productos/{productosId}: Obtienen los productos

### POST /productos/categorias/{categoriaId}: Crea un producto dentro de una categoría.

### PUT /productos/{productoId}: Actualiza un producto existente.

### PUT /productos/categorias/{categoriaId}: Actualiza un producto de una categoría

### DELETE /productos/{productoId}: Elimina un producto.

# 6. Planificación del desarrollo

### Tareas principales divididas por equipo o persona

| Equipo/Persona       | Tareas principales |
|----------------------|--------------------|
 **Frontend (React)** 
- Maquetar pantallas (inicio, comercios, productos, contacto)  
- Implementar navegación y rutas  
- Conectar con la API REST  
- Validación de formularios  
- Diseño responsive 

 **Backend (Spring Boot)** 
- Modelado de base de datos (admin, productos, comprador, provincias)  
- Crear endpoints RESTful  
- Seguridad básica (login, registro)  
- Gestión de errores y validaciones 

**Base de datos**    
- Crear el modelo entidad-relación 
- Crear las tablas en MySQL  
- Definir relaciones entre entidades
 **Testing & QA**     
- Probar endpoints con Postman  
- Pruebas funcionales en frontend  
- Validación de datos y flujos de usuario
**Documentación**   
- Redactar README.md  
- Documentar endpoints  
- Manual de usuario básico

---

### Cronograma estimado (por sprints/semanas)

| Semana | Objetivos principales |
|--------|------------------------|
 **Semana 1 (Sprint 1)** 
- Definición de requerimientos  
- Bocetos de interfaz (mockups)  
- Crear repositorios y entorno local 

**Semana 2 (Sprint 2)**  
- Implementar backend básico: entidades, repositorios, controladores  
- Primeros componentes en frontend
- Registro/login de usuarios
- Conexión frontend-backend  
- CRUD de productos y comercios  


**Semana 3 (Sprint 3)**
- Diseño responsive  
- Validaciones  
- Pruebas y correcciones 
- Documentación final  
- Presentación del proyecto 

---

### Riesgos potenciales y cómo mitigarlos

| Riesgo | Mitigación |
|--------|------------|
| **Retrasos por falta de tiempo** | Dividir tareas bien desde el principio y seguir sprints cortos |
| **Dificultades técnicas (API, conexión frontend-backend)** | Buscar apoyo del equipo, usar documentación oficial y herramientas como Postman o Insomnia |
| **Problemas con Git (conflictos o pérdida de código)** | Usar ramas correctamente y hacer commits frecuentes con mensajes claros |
| **Errores** | Hacer pruebas antes de desplegar, tener backups |
| **Falta de comunicación en el equipo** | Reuniones semanales, usar herramientas como Kanbam o WhatsApp para coordinar |

# 7. Consideraciones adicionales

## Accesibilidad

Rellenar

## Internacionalización (i18n) si aplica

Rellenar

## Seguridad básica (autenticación, validación de datos)

Rellenar

## Buenas prácticas (nombres, carpetas, uso de Git, testing básico)

Rellenar

# 8. Herramientas para la planificación y gestión del proyecto

## Planificación del desarrollo

Uso de herramintas con métodología Kanban mediante _monday work_

## Colaboración del equipo

Uso de Git, GitHub, Discord y Whatsapp para una comunicación fluida

## Seguimiento y testing

Uso de Postman para comprobar el buen funcionamiento de la API
