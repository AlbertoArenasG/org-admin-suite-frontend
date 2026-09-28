# Breakdown De Implementacion

## Slice 1: Estado De Lectura

- Frontend define el tipo y mapeador de detalle, thunk, reducers y reset.
- Verifica carga, error, request obsoleta y recurso ausente.

## Slice 2: Shell Y Navegacion

- Columna `Detalle` no ocultable junto al folio, con enlace inline persistente;
  el folio tambien enlaza directamente al detalle.
- Ruta protegida, breadcrumbs dinamicos y skeleton estructural.
- Configuracion reutilizable de items para navegacion normal y compacta.
- Confirma que la variante cliente no contiene proveedor.

## Slice 3: Bloques Read-only

- Generales, cliente/compromiso, equipo y documentos raiz.
- Timeline cliente desde recepcion, con materializacion de compromiso.
- Sin acciones de edicion ni solicitudes de opciones administrativas.

## Slice 4: Documentos Y QA

- Presentacion documental de lectura compartida.
- Preview, descarga, teclado, foco y reduced motion.
- Responsive en sidebar abierto/cerrado y viewport compacto.
