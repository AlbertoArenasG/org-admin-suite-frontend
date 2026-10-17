# Tareas

## Fase 1. Integracion Tipada

- [ ] Implementar cliente multipart, thunk y rama `upload` de la slice
      existente con clasificacion de respuestas.
      Status: pending. Dependencia: handoff API vigente. Cierre: payload,
      envelope, estados y errores coinciden con el contrato sin tocar la API.

## Fase 2. Flujo De Dialogo Y Tabla

- [ ] Implementar selector ZIP, estados persistentes, accion primaria,
      traducciones y refresco de listado.
      Status: pending. Dependencia: fase 1. Cierre: cumple criterios 1-7 sin
      modificar DataTable ni cerrar automaticamente el resultado.

## Fase 3. Verificacion Y Cierre

- [ ] Ejecutar build/lint pertinentes, verificar diff y registrar riesgos.
      Status: pending. Dependencia: fase 2. Cierre: checks ejecutados y
      documentados, sin cambios fuera de alcance.
- [ ] Solicitar al usuario validacion manual en entorno con API accesible.
      Status: pending. Dependencia: fase 2. Cierre: evidencia de
      `08-manual-validation.md` confirmada por el usuario.
- [ ] Actualizar el catalogo de autorizacion API con el nuevo consumidor,
      auditar tareas, progreso, documentacion viva e indice y cerrar la spec.
      Status: pending. Dependencia: validacion manual. Cierre: estados y
      checkboxes coherentes; no hay tareas abiertas.
