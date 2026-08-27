# Implementation Breakdown

## Slice 1. Primitivas y copies compartidos

- Incorporar el `RadioGroup` reutilizable y el helper de insignias.
- Añadir copies bilingües para clasificación, ayuda, filtro y tooltips.

## Slice 2. Contratos y estado

- Agregar `isInternalStaff` a Usuarios e Invitaciones.
- Migrar Contactos y Grupos de destinatarios desde `type`.
- Conectar filtros de listado con el contrato de API y la URL.

## Slice 3. Formularios

- Integrar clasificación obligatoria en invitaciones `USER`.
- Integrar transiciones por system role en invitaciones y edición de Usuarios.
- Integrar clasificación en creación y edición de Contactos manuales.

## Slice 4. Consultas administrativas

- Agregar columnas de insignias a Usuarios, Invitaciones y Contactos.
- Integrar insignias en los detalles.
- Incorporar selectores de filtro de personal en Usuarios y Contactos.

## Slice 5. Verificación

- Revisar flujos de alta, edición, listas, filtros y detalles bajo ambos temas.
- Ejecutar compilación y chequeo de diff.
