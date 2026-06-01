# CampusMarket

Plataforma de marketplace académico desarrollada para estudiantes universitarios, donde los usuarios pueden comprar y vender productos, ofrecer servicios de tutoría y construir reputación dentro de un ecosistema universitario confiable.

---

## Descripción

CampusMarket es una aplicación basada en Domain-Driven Design (DDD) que organiza el sistema alrededor de capacidades del negocio y contextos delimitados.

La plataforma permitirá:

- Comprar y vender productos académicos
- Publicar servicios
- Ofrecer tutorías
- Gestionar reputación
- Utilizar autenticación segura

---

## Arquitectura

El proyecto utiliza:

- Monolito Modular
- Arquitectura por Capas
- Domain-Driven Design (DDD)
- API REST

### Contextos Delimitados

- Identidad
- Marketplace
- Tutorías
- Reputación

---

## Tecnologías

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Clerk
- JWT
- Maven
- Lombok

### Frontend

- HTML
- CSS
- JavaScript

### Infraestructura

- Supabase PostgreSQL
- AWS / Digital Ocean

---

## Estructura del Proyecto

```text
src/main/java/org/uce/campusmarket

├── shared
├── identity
├── marketplace
├── tutoring
├── reputation
```

---

## Estado Actual

Proyecto en desarrollo.

MVP inicial:

- [ ] Autenticación
- [ ] Marketplace
- [ ] Tutorías
- [ ] Seguridad Clerk
- [ ] Base de datos PostgreSQL
- [ ] Frontend
- [ ] Despliegue

---

## Equipo

- María Llano
- Bryan Quishpe
- José Soto

---

## Propósito Académico

Proyecto desarrollado con fines académicos para demostrar la aplicación práctica de Domain-Driven Design, arquitectura modular y desarrollo full stack.