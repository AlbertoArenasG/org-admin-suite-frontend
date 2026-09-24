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
- Se implementaron las tres slices: contrato `rowActions`, primitive
  `ContextMenu`, dialogo destructivo compartido, menus y activacion primaria
  de DataTable, y primera adopcion administrativa autorizada.
- Se actualizo la guia viva de DataTable; lint dirigido, typecheck y build de
  produccion completaron correctamente. El build conserva dos warnings
  preexistentes de modulos fuera del alcance.
- Producto completo la validacion manual de Component Lab y Registros
  administrativos: menus, doble clic, permisos, dialogo destructivo, estados
  y regresiones de tabla quedaron validados.
- La spec queda completada: las tres slices, la documentacion viva y la matriz
  de validacion estan cerradas.
