# Progreso

## 2026-10-17: Definicion

- Acordados un ZIP por intento, acceso desde listado READ, dialogo sin
  stepper con resultado persistente y manejo explicito de respuesta incierta.
- Verificados el contrato real del endpoint, el handoff API, la toolbar de
  DataTable, el selector compartido y el patron multipart existente.
- Spec documentada y lista para implementacion; no se ha escrito codigo de
  frontend ni se ha ejecutado validacion funcional.
- Siguiente paso: Slice 1 de integracion tipada.

## 2026-10-17: Ajuste De Ownership Antes De Implementar

- Una revision del feature confirmo que las mutaciones remotas vigentes usan
  thunk y la slice existente. Se ajusto el diseno: seleccion del `File` local,
  transporte en cliente del feature y lifecycle remoto en thunk/rama `upload`.
- No se ha implementado codigo; las tareas y validaciones permanecen
  pendientes.

## 2026-10-17: Implementacion De Slices 1 Y 2

- Cliente multipart, thunk y estado `upload` implementados en el feature
  existente. El envio usa `package` y `origin=backoffice` y distingue exito
  confirmado, error HTTP y resultado incierto sin reintento automatico.
- La lista ofrece `Cargar ZIP` mediante un dialogo con seleccion local,
  confirmacion, progreso y resultado persistente. El exito refresca la lista;
  ante error o incertidumbre se ofrece verificar el listado sin reenviar.
- Typecheck, lint focalizado y `git diff --check` pasaron. El build de Next
  quedo bloqueado por DNS al descargar Geist/Geist Mono desde Google Fonts
  (`getaddrinfo ENOTFOUND fonts.googleapis.com`), no por un error de codigo
  detectado.
- La validacion funcional de `08-manual-validation.md`, el build en un entorno
  con fuentes accesibles y el cierre de la spec siguen pendientes. No se
  registran resultados manuales no observados.
- Refinamiento visual: el ZIP deja montado el selector y su fila hasta iniciar
  el POST, con animacion local de preparacion antes de habilitar el envio.
  `AttachmentUploadDialog` regreso sin diff respecto a `HEAD`; el ZIP consume
  el vendor directamente y mantiene su coordinacion especializada en el
  modulo. Se eliminaron wrapper y hook compartidos que no hacian falta.
  El vendor solo admite textos opcionales sin alterar defaults. Falta la
  prueba visual y funcional del usuario.

## 2026-10-17: Validacion Y Cierre

- El usuario confirmo haber validado todos los escenarios de
  `08-manual-validation.md`, incluidos exito, error HTTP, corte de red,
  permisos, escritorio/movil, temas, teclado y lector de pantalla. No se
  registraron cuentas ni dispositivos concretos; la evidencia es su
  confirmacion, no una ejecucion independiente del agente.
- `npm run typecheck` y `npm run lint` finalizaron sin errores. El lint reporto
  cinco warnings existentes fuera de esta feature. `git diff --check` paso.
  `npm run build` se ejecuto, pero no pudo descargar Geist/Geist Mono porque
  el entorno no resolvio `fonts.googleapis.com` (`ENOTFOUND`). No se atribuye
  ese bloqueo a cambios de codigo ni se registra el build como exitoso.
- El catalogo vivo de autorizacion API reconoce a Next Dashboard como segundo
  consumidor del upload publico, sin crear permiso `CREATE` ni modificar la
  proteccion del endpoint. Tareas, matriz, estados e indice quedaron cerrados.

## 2026-10-17: Verificacion Posterior Del Build

- Fuera del alcance funcional de esta spec, el frontend paso a servir Geist y
  Geist Mono con `next/font/local` y archivos licenciados incluidos en el
  proyecto. El build ya no consulta Google Fonts.
- Un build ejecutado sobre el mismo `.next` usado por el servidor de desarrollo
  activo fallo al recolectar `/_document`. Se verifico una copia temporal
  aislada del mismo codigo: `next build` termino correctamente y genero todas
  las rutas. No se cambio el estado completado de esta spec.
