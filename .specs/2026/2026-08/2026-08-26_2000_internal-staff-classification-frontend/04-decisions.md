# Decisions

## Decision 01. Etiqueta y control de clasificacion

- Estado: `approved`
- Los formularios usan el control explicito `Pertenece a Implementos Cientificos` con valor Si/No.
- Incluye la ayuda: `Indica si forma parte del personal de Implementos Cientificos.`
- Para invitaciones y Usuarios `ADMIN` o `MASTER_ADMIN`, el control se presenta como interno fijo y no permite seleccionar un valor invalido.
- Para invitaciones `USER` y Contactos manuales, la seleccion es explicita y obligatoria conforme al contrato de backend.

## Decision 02. Insignias de clasificacion en consultas

- Estado: `approved`
- Las listas y detalles de Usuarios, Invitaciones y Contactos incorporaran una columna o zona visual de insignias, sin encabezado visible y con etiqueta accesible `Clasificacion`.
- `Microscope` representa `is_internal_staff: true`, independientemente del system role.
- `UserStar` representa exclusivamente `ADMIN`; no se muestra para `MASTER_ADMIN`.
- Las insignias llevan tooltip localizado y pueden coexistir porque expresan atributos distintos.
- `is_internal_staff: false` no muestra insignia; no representa una alerta ni requiere una categoria visual negativa.

## Decision 03. Superficies y control de edicion

- Estado: `approved`
- La clasificacion se captura en invitacion de Usuario, edicion de Usuario, creacion de Contacto manual y edicion de Contacto manual.
- Las insignias son estrictamente informativas: aparecen en listados y, cuando corresponda, junto al nombre en detalles; nunca son botones ni controles de modificacion.
- Los formularios usan un campo independiente `Pertenece a Implementos Cientificos` con control segmentado o radio group estilizado de opciones Si/No.
- El selector de rol conserva su responsabilidad actual y no se reemplaza con insignias.
- Para `ADMIN` y `MASTER_ADMIN`, el campo se muestra como interno fijo y no permite una seleccion invalida.
- No se expone edicion de clasificacion para Contactos vinculados a Usuarios.

## Decision 04. Transiciones de system role

- Estado: `approved`
- Al seleccionar `ADMIN` o `MASTER_ADMIN`, el formulario fija `Pertenece a Implementos Cientificos` en Si y deshabilita el control.
- En creacion de invitacion, al cambiar desde un rol interno fijo a `USER`, el formulario limpia la seleccion y exige elegir explicitamente Si o No.
- En edicion, al cambiar desde `ADMIN` o `MASTER_ADMIN` a `USER`, conserva Si como valor inicial editable porque es el valor efectivo persistido.

## Decision 05. Filtros de clasificacion en listados

- Estado: `approved`
- Los listados de Usuarios y Contactos reemplazan cualquier filtro o representacion legacy de `type` por `is_internal_staff`.
- Cada toolbar usa el selector reutilizable basado en Radix/shadcn, sin dependencias de MUI ni estilos ajenos al tema.
- Las opciones son `Todo el personal`, `Personal de Implementos Cientificos` y `Personal externo`.
- En Usuarios, el filtro se envía como `is_internal_staff=true|false` y puede coexistir con los filtros de Cliente. En Contactos, se envía al endpoint de listado equivalente.
- Eliminar `ContactType`, `type`, `typeLabel` y el query `type` de los modelos y consumidores de Contactos, incluidos los resúmenes de grupos de destinatarios.

## Decision 06. Control de captura

- Estado: `approved`
- La clasificación se captura con un `RadioGroup` reutilizable de dos opciones visibles: `Sí` y `No`.
- El control se etiqueta `Pertenece a Implementos Cientificos` e incluye la ayuda aprobada.
- Se usa en invitaciones `USER`, edición de Usuarios cuando el rol lo permite y creación o edición de Contactos manuales.
- Para `ADMIN` y `MASTER_ADMIN`, el valor efectivo es `Sí` y el control queda deshabilitado.

## Decision 07. Ubicacion de insignias

- Estado: `approved`
- Usuarios, Invitaciones y Contactos muestran una columna estrecha de insignias, sin encabezado visible, en sus listados administrativos.
- Los detalles muestran las mismas insignias junto al nombre principal cuando existan.
- `Microscope` se muestra para cualquier entidad con `is_internal_staff: true`, incluido `MASTER_ADMIN`; no existe tratamiento visual especial para su system role respecto a esta bandera.
- `UserStar` se muestra exclusivamente para `ADMIN`; nunca para `MASTER_ADMIN`.
- La ausencia de insignias representa personal externo y no requiere un indicador negativo.
