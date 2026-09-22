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
