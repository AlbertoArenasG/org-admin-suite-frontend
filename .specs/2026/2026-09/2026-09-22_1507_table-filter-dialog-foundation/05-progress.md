# Progress: Table Filter Dialog Foundation

## 2026-09-22 - Apertura

- Se registró la iniciativa a partir de los experimentos validados en
  Component Lab.
- Se confirmó que el producto ya cuenta con primitives y dependencias para la
  variante aprobada de dos pickers separados.
- Se confirmó que la primera adopción no exige cambios al endpoint ni al
  contrato de query de Registros de servicio.
- Se dejó pendiente la decisión de ubicación y frontera de los artefactos
  compartidos. No hay implementación autorizada todavía.

## 2026-09-22 - Frontera De Componentes

- Se aprobó `src/components/table-filter/` como ubicación de la fundación.
- Se identificó que `LocalizedDateInput` tiene tres consumidores y no cubre el
  contrato de captura manual ni el picker requerido. Su modificación global
  queda descartada provisionalmente; la composición local espera aprobación.

## 2026-09-22 - Separación De Fecha Aprobada

- Se aprobó `TableFilterDateInput` como composición local. El diálogo conserva
  borrador, el rango conserva la coordinación de campo/período y el input
  conserva la captura y normalización de una fecha.
- Se abrió la decisión de compatibilidad para URLs históricas que acumulen más
  de un rango. No se implementará una pérdida silenciosa de criterios.

## 2026-09-22 - Definición Cerrada

- Se aprobó preservar rangos acumulados de URLs históricas hasta confirmación
  explícita del diálogo.
- El estado heredado se mostrará como tal y no activa el primario por sí solo.
- La definición quedó completa y habilitada para implementación.

## 2026-09-22 - Slice 1 Completada

- Se creó `src/components/table-filter/` con diálogo controlado, sección,
  selector configurable, input localizado de fecha, período separado, tipos y
  exportaciones públicas.
- La fundación no importa módulos, stores, rutas, permisos, URL ni clientes
  remotos; esa adaptación permanece reservada para la Slice 2.
- Se ejecutaron Prettier, `npm run typecheck`, lint acotado a la nueva carpeta
  y `git diff --check` correctamente.

## 2026-09-22 - Slice 2 Implementada

- Se sustituyeron los controles directos y rangos acumulables del toolbar por
  `CustomerServiceRecordsFilterDialog`.
- El adaptador del módulo separa el modelo visual de
  `CustomerServiceRecordsListFilters` y conserva URL históricas con varios
  rangos hasta una acción explícita.
- Elegir solo el campo de fecha no sustituye criterios heredados; se requiere
  seleccionar al menos un límite o limpiar filtros deliberadamente.
- La confirmación conserva el flujo existente de actualización de filtros,
  reset de página, URL y fetch desde el contenedor.
- Prettier, typecheck, lint acotado y `git diff --check` pasaron. El build de
  producción compiló correctamente después de habilitar acceso a fuentes;
  reportó solo warnings preexistentes fuera de esta iniciativa.

## 2026-09-22 - Corrección De Edición De Fecha

- La máscara dejó de reagrupar todos los dígitos al editar una fecha formada.
  Conserva sus segmentos, por lo que sustituir un dígito del día no desplaza
  mes ni año.
- Typecheck, lint acotado, `git diff --check` y build de producción pasaron;
  los warnings de build siguen siendo ajenos a esta iniciativa.

## 2026-09-22 - Validación Y Promoción Final

- Se aprobó la validación manual funcional, visual, responsive y de los flujos
  de fecha, incluidos los listados desplazables de clientes y tipos de
  servicio.
- Se promovió el contrato a `docs/ui/patterns/table-filter-dialog.md` y se
  registró la primera adopción de Registros de servicio en el registro de UI.
- La Slice 3 queda cerrada; no quedan tareas funcionales pendientes en esta
  iniciativa.

## 2026-09-22 - Conteo Y Limpieza Rápida

- La toolbar de Registros de servicio muestra un conteo compacto por categoría
  de filtro aplicada, sin introducir chips externos.
- Con criterios activos, el trigger forma un grupo con una acción inmediata de
  limpiar filtros. El contenedor existente conserva el reset de página, URL y
  fetch.
- El conteo y la limpieza viven en el consumidor de dominio; la fundación
  `table-filter` conserva su frontera neutral.
- La validación manual confirmó el tooltip y la transición breve de limpieza.
