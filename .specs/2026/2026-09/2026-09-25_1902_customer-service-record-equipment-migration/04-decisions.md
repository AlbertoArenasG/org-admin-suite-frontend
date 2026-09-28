# Decisions: Customer Service Record Equipment Migration

## One Equipment In The UI

La interfaz muestra y permite editar únicamente el primer equipo de
`record.assets`. No habrá lista, alta, eliminación ni controles para múltiples
equipos. El arreglo en backend existe para una posible necesidad futura y no
define la experiencia actual.

## Attachments Are Independent Equipment Subsections

El frame de Equipo contiene cuatro formularios y `ResourceFormSection`
hermanos: datos principales, evidencia de recepción, evidencia de entrega y
reportes. Cada colección usa `DocumentCollectionList`, conserva sus propias
acciones y envía solo su arreglo de IDs mediante PATCH. No se reconstruyen ni
se fusionan payloads de otras subsecciones.

## Independent Form And Mutation

Equipo mantiene schema, draft, validación y mutación propios. Comparte la
receta visual y de comportamiento de `ResourceForm`, no el estado de detalles
generales ni cliente/entrega.

## Missing Equipment Is Not Creatable Here

Sin `assets[0]` se muestra un estado no editable. No se improvisa una operación
de creación ni se emite un PATCH sin `assetId`.

## Navigation Remains Anchors

La navegación de secciones se extiende a tres enlaces semánticos y conserva
scroll spy. No se transforma en tabs ni se añade semántica ARIA de tabs.
