# Decisiones

## D1. Acceso Y Autorizacion

La accion se presenta en la lista protegida por `SERVICE_PACKAGES.READ`.
No se crea permiso `CREATE` ni se presenta el boundary como proteccion del
endpoint, que sigue publico. Alternativa descartada: agregar guard y cambiar
la PWA como parte de este alcance.

## D2. Dialogo Sin Stepper

Un solo dialogo contiene seleccion, envio y resultado persistente. El usuario
no navega pasos independientes. Usa directamente el selector visual
`AttachmentUpload` del vendor. `AttachmentUploadDialog` permanece intacto:
su contrato es seleccionar archivos localmente y cerrar al confirmar, no
realizar una mutacion remota. El dialogo ZIP maneja sus propios estados de
preparacion local y envio; la animacion inicial no representa progreso del
POST remoto. Solo se agregan textos opcionales al vendor para el caso ZIP,
sin alterar los defaults de sus otros consumidores.

## D3. Una Carga Por Intento

Un ZIP `.zip` no vacio por envio, sin reintento automatico ni limite menor
arbitrario. El default de 500 MB del control compartido se desactiva mediante
`maxFileSize={Infinity}` y una descripcion propia; no se promete que la
infraestructura acepte cualquier tamano.

## D4. Resultado Observado, No Supuesto

Exito solo con envelope valido y `services[]`. Error HTTP advierte posible
carga parcial. Fallo de transporte o respuesta no interpretable significa
resultado incierto, no fracaso confirmado. En exito se refresca la tabla sin
borrar los filtros; en todos los resultados el dialogo permanece hasta cierre
explicito. No se habilita otra carga desde el mismo estado de resultado.

## D5. Origen Diagnostico

El frontend envia `origin=backoffice` al endpoint existente. Es metadato
de observabilidad, no evidencia autenticada. La PWA no se modifica.

## D6. Ownership De Mutacion Y Estado

El cliente del feature contiene el transporte multipart; un thunk en
`servicePackagesRecordsThunks.ts` coordina la mutacion y la slice existente
guarda solo estado y resultado serializables del intento. El `File` se
selecciona en el dialogo y nunca se guarda en Redux. La rama `upload` se
resetea al cerrar; una respuesta tardia no debe repoblar un dialogo cerrado.
Esto sigue el patron de mutaciones remotas del modulo sin crear una slice
independiente. Se descarta la llamada directa desde el JSX porque seria una
excepcion innecesaria al ownership ya establecido.
