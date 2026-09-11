# Plan

## Fase 1. Composición Neutral

Crear `ResourceFormFrame`, `ResourceFormSection` y `ResourceFormActions` como
composiciones sin datos de negocio. Validar que sus props expresen lectura,
edición, feedback y acciones sin crear un tipo de valores compartido.

## Fase 2. Hosts De Experiencia

Crear `ResourceFormRoute` y `ResourceFormOverlay`. El host overlay recibe
`Dialog` o `Drawer` del consumidor; no selecciona una variante ni implementa
su propia política responsive.

## Fase 3. Contrato Y Verificación

Exportar la superficie pública desde un único índice, verificar límites de
imports, typecheck, lint y build. Registrar la composición en el catálogo vivo
solo si existe un preview de producto que no dependa del Component Lab.

## Entrega Posterior

Una spec de recurso será dueña de adoptar la base. Para usuarios se abrirá una
iniciativa separada de creación/invitación y migración, con formularios por
intención y decisión propia de ruta u overlay. No es parte de este plan.
