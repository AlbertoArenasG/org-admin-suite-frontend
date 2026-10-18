# Tareas

## Fase 1. Integracion Tipada

- [x] Implementar cliente multipart, thunk y rama `upload` de la slice
      existente con clasificacion de respuestas.
      Status: done. Dependencia: handoff API vigente. Cierre: payload,
      envelope, estados y errores coinciden con el contrato sin tocar la API.

## Fase 2. Flujo De Dialogo Y Tabla

- [x] Implementar selector ZIP, estados persistentes, accion primaria,
      traducciones y refresco de listado.
      Status: done.
      Dependencia: fase 1. Cierre: flujo y estados integrados sin modificar
      DataTable ni cerrar automaticamente el resultado.

## Fase 3. Verificacion Y Cierre

- [x] Ejecutar build/lint pertinentes, verificar diff y registrar riesgos.
      Status: done. Dependencia: fase 2. Cierre: checks ejecutados y
      documentados; build de produccion validado en copia aislada tras resolver
      la dependencia de Google Fonts.
- [x] Solicitar al usuario validacion manual en entorno con API accesible.
      Status: done. Dependencia: fase 2. Cierre: matriz de
      `08-manual-validation.md` confirmada por el usuario.
- [x] Actualizar el catalogo de autorizacion API con el nuevo consumidor,
      auditar tareas, progreso, documentacion viva e indice y cerrar la spec.
      Status: done. Dependencia: validacion manual. Cierre: estados y
      checkboxes coherentes; no hay tareas abiertas.
