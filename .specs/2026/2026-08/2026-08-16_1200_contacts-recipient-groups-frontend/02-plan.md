# Plan

## Objective

Implementar en frontend los módulos administrativos de `contacts` y `recipient_groups`, siguiendo el patrón actual del proyecto y dejándolos listos para reutilización posterior por otros módulos consumidores.

## Target Design

- feature dedicado para `contacts`
- feature dedicado para `recipient_groups`
- rutas separadas para listado, detalle, create y edit
- formularios compartidos entre create/edit cuando aplique
- integración de `communication_channels` como catálogo auxiliar del flujo de grupos
- navegación y permisos alineados con el modelo actual del dashboard

## Phases

### Phase 1. Definition And Contracts

- cerrar decisiones del alcance y estructura de ambos módulos
- aterrizar contratos HTTP realmente usados
- definir rutas, estado y restricciones visuales

### Phase 2. Data And State Foundation

- definir feature state para `contacts`
- definir feature state para `recipient_groups`
- resolver mappings request/response
- aterrizar catálogos auxiliares necesarios

### Phase 3. Core UI

- implementar superficies administrativas de `contacts`
  - contratos y slice
  - rutas y páginas
  - listado
  - detalle
  - formulario compartido
  - delete y reglas visuales
- implementar superficies administrativas de `recipient_groups`
  - contratos, slice y catálogo auxiliar
  - rutas y páginas
  - listado
  - detalle
  - formulario compartido
  - lookup y selección múltiple de contactos
  - alta de contacto en contexto
  - delete y reglas visuales
- resolver vínculos entre ambos módulos en formularios

### Phase 4. Validation And Cleanup

- validar navegación, permisos y flujos principales
- actualizar spec y progreso
- dejar la base lista para módulos consumidores futuros

## Sequencing Notes

- conviene aterrizar primero `contacts`, porque `recipient_groups` depende de selección de contactos
- no conviene diseñar todavía UX embebida de consumo en otros módulos
- primero debe cerrarse la estructura administrativa propia de ambos recursos

## Exit Criteria

- frontend consume el CRUD de `contacts`
- frontend consume el CRUD de `recipient_groups`
- ambos módulos siguen el patrón estructural ya existente del proyecto
- la spec queda suficientemente aterrizada para no depender de esta sesión
