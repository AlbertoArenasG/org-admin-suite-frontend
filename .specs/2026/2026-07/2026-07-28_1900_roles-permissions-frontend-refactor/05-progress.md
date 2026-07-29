# Progress

## 2026-07-29

- Se creo la primera spec real de frontend para el refactor de roles y permisos.
- Se dejo la iniciativa registrada en `.specs/index.md`.
- Se documentaron definicion inicial, analisis, plan, task list y diseño tecnico base.
- Se formalizo que el objetivo del frontend es trabajar ya sin depender del modelo legacy como base de diseño.
- Se aprobo como Decision 01 que la autorizacion funcional del frontend debe depender de permisos y modulos efectivos, no de `system_role`.
- Se dejo explicitado que, al `2026-07-29`, el frontend actual no tiene superficies exclusivas de plataforma; todo lo existente pertenece al dominio de negocio.
- Se aprobo como Decision 02 que el frontend debe separar identidad del usuario autenticado y estado de autorizacion de la sesion, eliminando `role` legacy como contrato principal.
- Se aprobo como Decision 03 una migracion por capas: primero auth y autorizacion, despues usuarios e invitaciones, luego navegacion y checks restantes, y al final limpieza.
- Se dejo explicitado que el sidebar debe migrarse para usar `modules` efectivos como visibilidad macro y `permissions` para visibilidad fina cuando aplique.
- Se aprobo como Decision 04 que el estado de autorizacion viva dentro de `auth` como un subbloque separado, con forma objetivo `auth.user` y `auth.authorization`.
- Se aprobo como Decision 05 que `modules` y `permissions` se guarden como arrays planos en `auth.authorization`, derivando estructuras optimizadas de consulta en selectors o helpers.
- Se aprobo como Decision 06 tratar `dashboard` como una vista transversal del frontend, separada de los modulos del backend y compuesta dinamicamente segun acceso real.
- Se cerro `00-definition.md` con `Definition status: completed` e `Implementation ready: yes`.
- Se aterrizo `06-technical-design.md` con contratos backend relevantes, estrategia de hidratacion, reglas de transicion de estado, capa objetivo de selectors/helpers y criterios de terminado por fase.
- Se aterrizo `07-implementation-breakdown.md` hasta nivel de slices y microfases ejecutables por futuras sesiones sin depender de este chat.
- Se actualizo `03-task-list.md` para reflejar que la fase de definicion ya esta cerrada y para dejar visibles tareas macro adicionales de navegacion, dashboard y cleanup.
