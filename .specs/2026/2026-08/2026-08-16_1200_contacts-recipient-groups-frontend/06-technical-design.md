# Technical Design

## Current State

La implementación frontend todavía no inicia. Este documento existe para endurecer el diseño técnico conforme se aprueben decisiones, sin depender de memoria de la sesión.

## Confirmed Base

- el backend para `contacts` ya existe
- el backend para `recipient_groups` ya existe
- `communication_channels` existe como catálogo auxiliar
- esta spec no cubre aún consumo embebido desde otros módulos

## Pending Technical Decisions

- estructura exacta de rutas para `contacts`
- estructura exacta de rutas para `recipient_groups`
- shape de estado frontend por módulo
- estrategia de búsqueda y selección de contactos dentro de grupos
