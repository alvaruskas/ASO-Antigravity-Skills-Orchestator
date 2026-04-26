# Guía Maestra de MCP y Agentes de IA en WordPress
> **La Nueva Frontera de la Automatización**

---

## 1. El Cambio de Paradigma: De la IA que Escribe a la IA que Actúa

El ecosistema de WordPress atraviesa una metamorfosis arquitectónica. Hemos trascendido la fase de la **"IA de consulta"** —donde modelos como ChatGPT generaban borradores aislados— para entrar en la era de los **Agentes de IA autónomos**. 

Esta transición representa un cambio estratégico en la gestión de activos digitales: pasamos de herramientas de procesamiento de lenguaje a **"agentes de acción"** con orquestación autónoma. A diferencia de los plugins tradicionales que gestionan funciones *siloed* (como generar un meta-título), un agente autónomo posee la capacidad de observar el estado global del sitio, identificar necesidades operativas y ejecutar secuencias complejas sin intervención manual constante.

### Pilares de la Propuesta de Valor
*   **Autonomía Programática:** Los agentes no solo responden; ejecutan flujos de trabajo completos, desde la moderación de comentarios basada en criterios de calidad hasta la sincronización masiva de catálogos.
*   **Conocimiento del Contexto Profundo:** El agente comprende la arquitectura del sitio (temas, jerarquías y plugins), adaptando su ejecución al sistema de diseño y lógica de negocio preexistente.
*   **Ejecución CRUD Integral:** La capacidad de Crear, Leer, Actualizar y Borrar (*Create, Read, Update, Delete*) transforma la administración del sitio en una operación de lenguaje natural traducida a comandos técnicos en tiempo real.

> [!TIP]
> Esta evolución depende de una infraestructura de conectividad robusta que desacopla la intención de la ejecución técnica.

---

## 2. Model Context Protocol (MCP): El Puente entre LLMs y WordPress

El **Model Context Protocol (MCP)** es el estándar abierto que permite a los grandes modelos de lenguaje (LLMs) como Claude, ChatGPT o Cursor obtener una visibilidad bidireccional sobre el sitio. 

Desde una perspectiva arquitectónica, el MCP actúa como la **interfaz contextual**, proporcionando al modelo los metadatos y el estado del sitio necesarios para eliminar alucinaciones, mientras que la **REST API** permanece como la capa de ejecución subyacente.

### Capacidades Técnicas: MCP y WordPress

| Categoría | Acciones de Lectura / Análisis | Acciones de Escritura / Gestión |
| :--- | :--- | :--- |
| **Arquitectura** | Descubrimiento de patrones de bloques y esquemas de temas. | Generación de layouts basados en el sistema de diseño activo. |
| **Operativa SEO** | Auditoría de accesibilidad y detección de falta de alt-text. | Optimización masiva de metadatos y corrección de enlaces internos. |
| **Interacción** | Análisis de sentimientos y detección de patrones de spam. | Ejecución de respuestas, aprobación o purga de comentarios. |
| **Media** | Inspección de dimensiones y metadatos de archivos. | Corrección de textos alternativos y títulos de medios. |

> [!IMPORTANT]
> Esta comunicación fluida requiere un motor capaz de traducir estas intenciones en cambios de estado en la base de datos: la WordPress REST API.

---

## 3. La Infraestructura Técnica: WordPress REST API como Motor de Agentes

La **WordPress REST API** es la columna vertebral de la integración. Funciona como la capa de abstracción que desacopla la lógica del agente del estado de la base de datos, permitiendo que aplicaciones externas realicen cambios mediante solicitudes estandarizadas.

### Interacción CRUD y Métodos HTTP
El impacto del agente en el servidor se define a través de métodos HTTP específicos:

*   **GET:** Recuperación de recursos (ej. auditoría de borradores o inventario de plugins).
*   **POST:** Creación de nuevos estados (ej. publicación automática de actualizaciones de productos).
*   **PUT/PATCH:** Modificación de recursos existentes (ej. actualización masiva de precios o metadatos).
*   **DELETE:** Eliminación de recursos, gestionada con políticas de seguridad para evitar pérdida de datos.

---

## 4. Seguridad y Autenticación: Protegiendo el Acceso de la IA

En un entorno de agentes autónomos, el acceso programático debe ser tan riguroso como el acceso humano. La seguridad es la **"línea de defensa"** que garantiza que solo entidades autorizadas interactúen con la API.

### Evaluación de Métodos de Acceso
1.  **Cookies + Nonces:** Utilizado para integraciones internas (JavaScript en el admin). Requiere el encabezado `X-WP-Nonce`.
2.  **JWT (JSON Web Tokens):** Recomendado para aplicaciones móviles y SPAs por su naturaleza *stateless*.
3.  **Application Passwords:** Introducidas en WordPress 5.6, son la **solución nativa más segura** para agentes externos.

### Implementación Profesional en Python

```python
import aiohttp
import os
from dotenv import load_dotenv

# Carga de credenciales desde archivo .env
load_dotenv()
WP_USER = os.getenv('WP_USER')
WP_APP_PASS = os.getenv('WP_APP_PASS')

async def create_agent_post(url, title, content):
    # HTTPS es no negociable para proteger la Basic Auth
    auth = aiohttp.BasicAuth(WP_USER, WP_APP_PASS)
    payload = {
        'title': title, 
        'content': content, 
        'status': 'draft'
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{url}/wp-json/wp/v2/posts", 
                                json=payload, 
                                auth=auth) as response:
            return await response.json()
```

---

## 5. El Futuro de la Extensibilidad: Abilities API y WordPress Agent Skills

La llegada de la **Abilities API** (WordPress 6.9+) marca el inicio de una era de "capacidades de primera clase". Las Abilities proporcionan un registro centralizado que permite a los agentes descubrir qué puede hacer un plugin mediante `wp_register_ability()`.

### Ventaja Crítica: Esquemas de Entrada/Salida
Estos esquemas actúan como validadores automáticos que aseguran que el agente no envíe datos malformados, reduciendo drásticamente las alucinaciones de código.

### WordPress Agent Skills
El proyecto dota a los agentes de conocimiento experto en:
*   `wp-block-development`: Creación de bloques Gutenberg.
*   `wp-rest-api`: Gestión avanzada de endpoints.
*   `wp-interactivity-api`: Desarrollo de frontends dinámicos.
*   `wp-phpstan`: Análisis estático y calidad del código.

---

## 6. Implementación Práctica: Casos de Uso

*   **SaleAI y la Eficiencia Operativa:** Gestión de SEO operativo (metadatos, enlaces internos) y actualización de catálogos masivos.
*   **AI Studio de SiteGround:** Integración directa en la infraestructura de hosting. Implementa la **"Explicit Consent Architecture"** (Modo Power), actuando como un *Guardrail* de seguridad donde el control final siempre es humano.

---

## 7. Conclusiones y Mejores Prácticas: El Humano en el Bucle (HITL)

La automatización no desplaza el juicio editorial; lo potencia. El modelo **Human-in-the-Loop (HITL)** es la base de una implementación ética y segura. 

### Listado de "Must-Haves" Arquitectónicos

1.  **HTTPS Obligatorio:** Cifrado total para toda comunicación de API.
2.  **Validación vía Schemas:** Uso de Abilities API para validar cada entrada del agente.
3.  **Principio de Mínimo Privilegio:** Asignar a la IA roles de usuario restringidos.
4.  **Guardrails Activos:** Acciones destructivas bajo confirmación humana.
5.  **Revisión de Borradores:** Configurar al agente para generar contenido en estado `draft`.

---
> [!NOTE]
> Dominar la tríada formada por **MCP**, la **REST API** y la **Abilities API** es la habilidad definitiva para el arquitecto de sistemas moderno.
