# Progress: Customer Service Record Creation Wizard Migration

## 2026-09-24

- Definicion completada tras validar contrato POST, ownership de estado,
  rutas, permisos y documentos vivos afectados.
- Aprobados: toolbar como superficie de alta, wizard de tres pasos, equipo
  unico, usuarios opcionales, fecha inicial vigente, formulario horizontal,
  descarte in-place y destino temporal de detalle legacy.
- Confirmado: toda operacion no `READ` seleccionada en el editor de roles
  incorpora `READ`; `CREATE` puede acceder a la tabla que contiene el wizard.
- Siguiente: Slice 1, contratos compartidos de toolbar y fecha de formularios.
