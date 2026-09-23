# Progress: DataTable Row Actions

## 2026-09-23

- Se abrio la iniciativa para institucionalizar acciones de fila en DataTable.
- Se aprobaron dropdown, menu contextual, folio enlazable y doble clic como
  vias complementarias de accion.
- Se aprobo `rowActions` como contrato opcional y extensible; se retirara el
  prop sin consumidores `getRowActions`.
- Se confirmo que la eliminacion de Next Dashboard usara un dialogo compartido
  y no el `Sheet` legacy.
- El analisis confirmo que Radix Context Menu ya esta disponible, las rutas de
  detalle/edicion ya existen y la mutacion Redux actual elimina la fila del
  listado al completarse.
- Se cerraron el diseno tecnico, registro de artefactos, desglose en tres
  slices y matriz de validacion manual. La spec esta lista para aprobacion de
  implementacion.
