# Task List: Canonical Shadcn Primitives and Theme Migration

## Phase 1. Definition And Foundation

- [x] Confirmar la base oficial `new-york`/Radix del producto o aprobar una migración independiente a Base UI.
      Status: done

- [x] Completar el inventario de tokens y definir el contrato único de cada tema.
      Status: done

## Phase 2. Canonical Primitives

- [x] Actualizar las primitivas shadcn afectadas en `src/components/ui` y revisar compatibilidad de consumidores.
      Status: done

- [x] Migrar el date range picker a las primitivas canónicas y retirar sus copias privadas.
      Status: done

## Phase 3. Theme Integration

- [x] Trasladar los valores de tokens a los archivos de tema y reducir `globals.css` al bootstrap global.
      Status: done

- [x] Eliminar wrappers y aliases de tema de date picker, filtros y lookup.
      Status: done

## Phase 4. Validation And Documentation

- [x] Verificar visualmente controles y rutas afectadas en los tres temas.
      Status: done

      La estructura del Date Range Picker se validó tras regenerar Calendar con
      la configuración CSS-first. El ajuste fino de sus esquinas se difiere a
      una iniciativa visual posterior.

- [x] Ejecutar lint, typecheck y build; actualizar documentación viva y bitácora.
      Status: done
