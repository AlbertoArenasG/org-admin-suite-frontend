# Recetas De Resource Form

## Propósito

Este documento cataloga composiciones aprobadas de `ResourceForm*`. Una receta
combina contratos existentes para resolver una necesidad visual recurrente; no
crea un componente nuevo, no sustituye la spec del recurso y no define su
persistencia, permisos ni datos.

## Frame Con Inset De Contenido

### Cuándo Usarla

Usar en detalles o ediciones de recursos con dos o más grupos de campos
relacionados, acciones globales y una mutación principal. La receta da una
jerarquía continua: el frame contiene el contexto y las acciones, y un único
panel interior contiene todos los grupos de campos.

No usar cuando cada sección sea una unidad de negocio independiente que deba
tener su propia superficie, acciones o persistencia.

### Composición

```tsx
<ResourceFormFrame
  contentSurface={{ base: 'bare', md: 'inset' }}
  density={{ base: 'compact', md: 'comfortable' }}
  headerDensity={{ base: 'compact', md: 'compact' }}
  dividers="hidden"
  footerActions={isEditing ? <ResourceFormActions {...actions} /> : null}
  headerActions={<GlobalActions />}
  mode={mode}
  surface={{ base: 'bare', md: 'card' }}
  title={title}
  description={description}
>
  <div className="grid gap-5">
    <ResourceFormSection surface="bare">
      <Fields />
    </ResourceFormSection>

    <Separator />

    <ResourceFormSection surface="bare">
      <Fields />
    </ResourceFormSection>
  </div>
</ResourceFormFrame>
```

### Resultado Visual

- En móvil, el frame y las secciones son `bare`, con densidad `compact`.
- Desde `md`, el frame es una card y el contenido usa un único `inset` con
  separación mínima respecto de su borde exterior.
- Las secciones internas son `bare`; `Separator` delimita los grupos sin
  apilar cards.
- Los encabezados de sección son opcionales. Se omiten cuando el título del
  frame y la agrupación visual ya dan contexto suficiente a los campos.
- `dividers="hidden"` mantiene el borde exterior del frame y deja que el
  inset establezca la separación visual del contenido, sin líneas bajo el
  header o sobre el footer.
- Las acciones globales pueden ir en `headerActions`; las de confirmar o
  cancelar una edición global van en `footerActions`.

### Límites

La receta no obliga a mostrar todos los slots. El recurso decide cuándo renderizar
el header, footer, acciones, secciones y campos según su modo, permisos y
operaciones disponibles. Los grids, la cantidad de secciones y el contenido de
cada una siguen siendo responsabilidad del recurso.

## Colección Documental Compacta

### Cuándo Usarla

Usar cuando un recurso necesita mostrar varias colecciones documentales dentro de
un único contexto visual, pero cada colección conserva su propia interacción de
lectura o edición. Mantiene una lista compacta sin convertir cada colección en
una card independiente.

### Composición

```tsx
<ResourceFormFrame
  contentSurface={{ base: 'bare', md: 'inset' }}
  density={{ base: 'compact', md: 'comfortable' }}
  dividers="hidden"
  headerDensity="compact"
  mode="read"
  surface={{ base: 'bare', md: 'card' }}
  title={title}
>
  <DocumentCollectionList>
    <form>
      <ResourceFormSection density="none" surface="bare">
        <DocumentCollectionItem />
      </ResourceFormSection>
    </form>
  </DocumentCollectionList>
</ResourceFormFrame>
```

### Reglas

- Cada colección vive en un `ResourceFormSection`; no usar elementos `section`
  manuales como sustituto de la primitive.
- Los formularios de colecciones son hermanos y nunca se anidan dentro del
  formulario de otra colección.
- `surface="bare"` y `density="none"` conservan la geometría de lista; los
  divisores pertenecen al contenedor de la colección.
- La respuesta responsive de la fila pertenece a `DocumentCollection` y usa
  una container query de `42rem`: arriba muestra metadata en una fila; abajo la
  apila. No depende del viewport ni del estado del sidebar.
- `DocumentCollection` envuelve la lista en un frame propio para una seccion
  documental raiz. Dentro de un frame ya existente, usar `DocumentCollectionList`
  directamente para no anidar frames.
- `DocumentCollectionItem` es dueño de la interacción completa del renglón. La
  carpeta React Bits es estrictamente visual: se desplaza sutilmente con hover
  o foco, y sólo abre cuando la colección se expande. En ese estado muestra los
  archivos dentro cuando los contiene; la acción de edición sigue aislada fuera
  del activador.
- `exposeFolderContents` es una variante exclusivamente visual para edición:
  con adjuntos y la colección expandida, expone los papeles por encima de la
  carpeta. La lectura conserva los papeles dentro.
- El color de carpeta no usa `primary`, que se reserva para acciones. Los
  tokens locales `--document-collection-folder-front` y
  `--document-collection-folder-back` viven en archivos de tema co-localizados
  con la colección y se resuelven para cada tema activo.
- Si una transición de modo monta una colección ya expandida, usar
  `animateInitialExpansion` para diferir un frame su presentación y conservar
  la misma apertura de carpeta y contenido que una expansión iniciada por el
  usuario. Aplica tanto al paso a edición como al retorno confirmado o
  cancelado a lectura. No usarla en colecciones que ya existen en el árbol.
- En edición, el borrador de adjuntos es una sola secuencia ordenable de
  entradas existentes y pendientes. El handle es el único activador de arrastre;
  previsualizar, descargar y quitar conservan acciones aisladas. Al guardar,
  las pendientes se cargan y sus IDs sustituyen su posición original antes de
  enviar el arreglo al endpoint.

## Skeleton Estructural

Usar mientras se carga un detalle o edición que adopta `ResourceForm*`. La
vista declara el número de filas de cada grupo y su orientación real:

```tsx
<ResourceFormSkeleton
  contentSurface={{ base: 'bare', md: 'inset' }}
  density={{ base: 'compact', md: 'comfortable' }}
  dividers="hidden"
  groups={[
    { fields: 4, orientation: 'responsive' },
    { fields: 3, orientation: 'responsive' },
  ]}
  headerActions={2}
  surface={{ base: 'bare', md: 'card' }}
/>
```

El skeleton hereda la geometría de frame, inset, secciones, separadores y
campos. No se configura para cada input ni contiene datos ficticios; una vista
solo declara su topología. `footerActions` se usa únicamente si el estado de
carga realmente anticipa un footer visible en el modo de llegada.

No convertir esta receta en un `variant` o preset de código hasta que varios
recursos la adopten con la misma semántica y sin extensiones relevantes.

## Confirmación Local De Guardado

Usar cuando el resultado pertenece únicamente a la mutación iniciada desde un
formulario de detalle o edición. El feedback ocupa temporalmente el mismo host
que las acciones de guardar y cancelar, por lo que no compite con un toast
global en otra región de la pantalla.

```tsx
<ResourceFormActions
  cancelAction={{ label: 'Cancelar', onClick: onCancel }}
  mutationFeedback={feedback}
  mutationRecovery={recovery}
  primaryAction={{ label: 'Guardar cambios' }}
  status={feedback?.status === 'saving' ? 'saving' : 'idle'}
/>
```

El módulo inicia con `{ status: 'saving', title: 'Guardando cambios' }`, cambia
a éxito al resolver la mutación. Cada recurso decide cuánto tiempo permanece
visible ese éxito y su transición posterior; el detalle editable de Usuario
usa dos segundos antes de volver a lectura. Ante error entrega
`mutationRecovery`: título, guía breve y el detalle del backend visible. Las
acciones nunca se reemplazan en este estado. `MutationFeedback` y
`MutationRecovery` viven en `components/feedback`, por lo que también pueden
usarse en hosts de diálogo o drawer. El componente no ejecuta transporte ni
decide cuándo cambiar de modo.
