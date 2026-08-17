# Analysis

## Current Context

- backend ya expone el módulo `internal-asset-control`
- backend ya expone las capabilities reutilizables necesarias para este flujo:
  - `recipient_groups`
  - `expiration_status_policies`
  - `expiration_notification_policies`
- frontend ya tiene integrados esos módulos administrativos reutilizables
- esta será la primera spec frontend que los consume dentro de un módulo operativo real

## What Makes This Module Special

- no es solo un CRUD plano
- consume dos policies reutilizables con responsabilidades distintas:
  - semáforo preventivo
  - notificación por vencimiento
- puede tener bloque opcional de provider
- puede disparar una acción manual de follow-up al provider
- modela registros históricos y no un catálogo maestro de activos

## Frontend Concerns To Close

- qué superficies visibles entran en `v1`
- cómo se representará visualmente:
  - `status` persistido
  - estado derivado por vencimiento
  - metadata de policies asociadas
- qué parte del create/edit será inline y qué parte será selección de recursos reutilizables
- cómo se integrará el follow-up manual al provider sin volver pesada la primera versión

## Working Assumption

Hasta que se apruebe una decisión distinta, la spec asume que el foco será:

- `internal-asset-maintenance-record`
- consumo de policies ya existentes
- follow-up manual al provider cuando aplique

sin mezclar automatización batch ni rediseño de los módulos ya cerrados.
