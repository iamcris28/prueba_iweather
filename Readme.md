# Proyecto iWeather - Documentación de Despliegue

Este documento detalla los artefactos y entregables para el despliegue del proyecto iWeather, una aplicación de consulta climática.


## 1. Pipeline de CI/CD

El proyecto utiliza el pipeline de CI/CD integrado de **Netlify**.

* **Integración Continua (CI):** Cada `git push` a la rama `main` en el repositorio de GitHub es detectado automáticamente por Netlify.
* **Despliegue Continuo (CD):** Una vez detectado el cambio, Netlify toma los archivos del repositorio y los publica en la URL de producción. Este proceso es completamente automático y toma menos de un minuto.

---

## 2. Scripts y Entorno de Despliegue

Dado que el proyecto es una aplicación de frontend estática (HTML, CSS, JS), **no se requiere un `Dockerfile` o scripts de Kubernetes**.

* **Entorno de Producción:** Es gestionado por Netlify, que sirve los archivos estáticos a través de su Red de Distribución de Contenido (CDN) global, garantizando baja latencia y alta disponibilidad.
* **URL de Producción:** `https://iweatherprueba.netlify.app/`

---

## 3. Plan de Recuperación ante Fallos

En caso de que un despliegue introduzca un error, el proceso de reversión ("rollback") es instantáneo.

1.  **Detección:** El error se identifica en el sitio en vivo.
2.  **Acción:** Se accede a la pestaña **"Deploys"** en el panel del proyecto en Netlify.
3.  **Solución:** Se selecciona un despliegue anterior que era estable y se hace clic en **"Publish deploy"** para restaurar esa versión inmediatamente.

---

## 4. Monitoreo y Métricas

El monitoreo se realiza con las herramientas integradas de Netlify.

* **Logs de Despliegue:** Se revisan los registros de cada despliegue en el panel de Netlify para asegurar que se completen sin errores.
* **Métricas de Tráfico:** Se utiliza el panel de **Netlify Analytics** para monitorear el número de visitantes, páginas vistas y posibles errores 404, ofreciendo una visión clara del estado y uso del sitio.