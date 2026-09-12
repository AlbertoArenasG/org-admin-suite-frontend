# Plan

## Fase 1. Composición Neutral

Crear `ResourceFormFrame`, `ResourceFormSection` y `ResourceFormActions` como
composiciones sin datos de negocio. Validar que sus props expresen lectura,
edición, feedback y acciones sin crear un tipo de valores compartido.

## Fase 2. Hosts De Experiencia

Crear `ResourceFormRoute` y `ResourceFormOverlay`. El host overlay recibe
`Dialog` o `Drawer` del consumidor; no selecciona una variante ni implementa
su propia política responsive.

## Fase 3. Integración De La Familia De Formularios

Incorporar las fuentes aprobadas de Shark/Ark bajo
`src/components/vendor/shark/`, sin sobrescribir primitives canónicas. Registrar
procedencia, dependencias, estilos estructurales, contrato de tokens y
actualización. La fundación `ResourceForm*` conserva su neutralidad y recibe
los hosts de overlay desde el consumidor.

## Fase 4. Contrato Y Verificación

Exportar la superficie pública desde un único índice, verificar límites de
imports, typecheck, lint y build. Crear un preview oficial que valide la
fundación con la familia Shark/Ark, incluyendo `Editable` controlado y hosts
`Dialog` y `Drawer`, antes de registrar la composición en el catálogo vivo.

## Entrega Posterior

Una spec de recurso será dueña de adoptar la base. Para usuarios se abrirá una
iniciativa separada de creación/invitación y migración, con formularios por
intención y decisión propia de ruta u overlay. No es parte de este plan.
