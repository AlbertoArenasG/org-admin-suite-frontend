# Definition

## Overall Status

- Initiative: `application-theme-foundation`
- Definition status: `completed`
- Implementation ready: `yes`
- Implementation status: `completed`

## Purpose

Sustituir la separación temporal entre tema general y apariencia del dashboard por una
fundación única de temas de aplicación. La fundación prepara los componentes nuevos y
migrados para temas completos sin obligar a refactorizar las vistas legacy.

## Decision 01. Temas iniciales

### Decision Final

Los temas iniciales son `Clásico`, `Ambient clásico` y `Ambient profundo`. Todos
mantienen el Workspace Canvas y el contenido operativo en tonos claros. `Clásico`
no introduce textura decorativa; las variantes ambient coordinan materiales
sutiles en shell y Content Inset, con distinta profundidad visual.

### Status

approved

## Decision 02. Alcance de la fundación

### Decision Final

Se implementan el selector global, los tokens semánticos iniciales, el puente de MUI y
los consumidores globales de tema. No se recorren módulos, tablas ni formularios legacy.
Esos componentes se adoptarán gradualmente al entrar en sus respectivas specs.

### Status

approved

## Decision 03. Persistencia

### Decision Final

La preferencia se conserva localmente mediante `next-themes`. La persistencia en backend
queda fuera de alcance y deberá evaluarse en una iniciativa posterior.

### Status

approved
