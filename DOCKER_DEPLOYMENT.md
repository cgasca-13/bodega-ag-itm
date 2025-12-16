# 🐳 Guía de Despliegue con Docker - Bodega AG ITM

## 📋 Requisitos Previos

### En tu computadora (desarrollo):
- Docker Desktop instalado
- Git
- Acceso al código del backend (Spring Boot)

### En la computadora de la escuela:
- Docker y Docker Compose instalados
- Acceso a internet (para descargar imágenes base)
- Puertos disponibles: Front 3005, Back 8085, PSQL 5435

## 🚀 Pasos para Dockerizar el Proyecto

### 1️⃣ Preparar el Backend (Spring Boot)

Crea un archivo `Dockerfile` en la raíz de tu proyecto Spring Boot:

```dockerfile
# Dockerfile para Spring Boot Backend
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar archivos de Maven/Gradle
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Descargar dependencias
RUN ./mvnw dependency:go-offline

# Copiar código fuente y compilar
COPY src src
RUN ./mvnw package -DskipTests

# Imagen de producción
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Construir la imagen del backend:
```bash
cd /ruta/al/backend
docker build -t bodega-backend:latest .
```

### 2️⃣ Configurar Variables de Entorno

1. **En desarrollo:** Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Edita `.env`** con tus valores reales:
   ```env
   # Base de datos
   DB_NAME=bodega_db
   DB_USER=bodega_user
   DB_PASSWORD=tu_password_seguro_123
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=tu_secret_aqui
   
   # JWT
   JWT_SECRET=un_secret_muy_largo_y_seguro_cambiar_en_produccion_minimo_256_bits
   
   # API URL (cambiar según entorno)
   API_URL=http://localhost:8085
   ```

### 3️⃣ Modificar `next.config.ts`

Agrega configuración para output standalone:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // ← Agregar esta línea
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

### 4️⃣ Construir y Ejecutar con Docker Compose

```bash
# Construir todas las imágenes
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar que todo esté corriendo
docker-compose ps
```

## 📦 Preparar para Despliegue en la Escuela

### Opción A: Exportar Imágenes Docker (SIN Internet en la escuela)

1. **Exportar las imágenes:**
   ```bash
   # Exportar frontend
   docker save bodega-ag-itm-frontend:latest -o bodega-frontend.tar
   
   # Exportar backend
   docker save bodega-backend:latest -o bodega-backend.tar
   
   # Exportar PostgreSQL (opcional, se puede descargar)
   docker pull postgres:16-alpine
   docker save postgres:16-alpine -o postgres.tar
   ```

2. **Copiar a USB:**
   - `bodega-frontend.tar`
   - `bodega-backend.tar`
   - `postgres.tar`
   - `docker-compose.yml`
   - `.env` (con valores de producción)

3. **En la computadora de la escuela:**
   ```bash
   # Cargar imágenes
   docker load -i bodega-frontend.tar
   docker load -i bodega-backend.tar
   docker load -i postgres.tar
   
   # Levantar servicios
   docker-compose up -d
   ```

### Opción B: Clonar Repositorio (CON Internet en la escuela)

1. **Subir código a GitHub/GitLab:**
   ```bash
   git add .
   git commit -m "Docker deployment ready"
   git push
   ```

2. **En la computadora de la escuela:**
   ```bash
   # Clonar repositorio
   git clone https://github.com/tu-usuario/bodega-ag-itm.git
   cd bodega-ag-itm/bodega-ag-itm
   
   # Configurar variables de entorno
   cp .env.example .env
   nano .env  # Editar con valores de producción
   
   # Construir backend (si no está en Docker Hub)
   cd /ruta/al/backend
   docker build -t bodega-backend:latest .
   
   # Levantar servicios
   cd /ruta/al/frontend
   docker-compose up -d
   ```

## 🔧 Configuración para Producción

### Cambiar API_URL en la escuela

En `.env`, cambia según la IP de la computadora:
```env
# Si todo está en la misma máquina
API_URL=http://localhost:8080

# Si se accede desde otras computadoras (usa la IP local)
API_URL=http://192.168.1.100:8080
```

### Configurar Spring Boot para Docker

En tu `application.properties` o `application.yml` del backend:

```properties
# application.properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# Cloudinary
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}

# JWT
jwt.secret=${JWT_SECRET}
```

## 📊 Comandos Útiles

```bash
# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# Reiniciar un servicio
docker-compose restart frontend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker-compose down -v

# Ver estado de servicios
docker-compose ps

# Acceder a la base de datos
docker-compose exec postgres psql -U bodega_user -d bodega_db

# Ver uso de recursos
docker stats
```

## 🌐 Acceder a la Aplicación

Una vez desplegado:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
- **PostgreSQL:** localhost:5432

Desde otras computadoras en la misma red:
- **Frontend:** http://[IP-SERVIDOR]:3000
- **Backend:** http://[IP-SERVIDOR]:8080

## 🔐 Seguridad en Producción

1. **Cambiar contraseñas por defecto:**
   - `DB_PASSWORD`
   - `JWT_SECRET`

2. **No versionar `.env`:**
   - Ya está en `.gitignore`
   - Compártelo de forma segura

3. **Usar HTTPS en producción:**
   - Configura un reverse proxy (Nginx/Caddy)

## 🐛 Solución de Problemas

### Frontend no conecta con Backend
```bash
# Verifica que los contenedores estén en la misma red
docker network inspect bodega-ag-itm_bodega-network

# Verifica las variables de entorno
docker-compose config
```

### Base de datos no inicia
```bash
# Ver logs
docker-compose logs postgres

# Verificar volúmenes
docker volume ls
```

### Puerto ya en uso
```bash
# Cambiar puertos en .env
FRONTEND_PORT=3001
BACKEND_PORT=8081
DB_PORT=5433
```

## 📝 Checklist de Despliegue

- [ ] Backend dockerizado y probado
- [ ] Frontend dockerizado y probado
- [ ] Variables de entorno configuradas
- [ ] Imágenes exportadas (si no hay internet)
- [ ] Docker Compose funciona localmente
- [ ] Documentación lista
- [ ] Credenciales de Cloudinary válidas
- [ ] Backup de base de datos (si aplica)

## 🎓 Para la Presentación

1. Llevar USB con:
   - Imágenes Docker (.tar)
   - docker-compose.yml
   - .env configurado
   - Esta guía impresa

2. Tiempo estimado de despliegue:
   - Con imágenes precargadas: 5-10 minutos
   - Construyendo desde cero: 15-20 minutos

3. Requisitos mínimos del servidor:
   - 4GB RAM
   - 10GB espacio en disco
   - Docker instalado
