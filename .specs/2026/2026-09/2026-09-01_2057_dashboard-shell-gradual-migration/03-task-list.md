# Lista de Tareas

## Fase 1. Definicion

- [x] Aprobar decisiones de URLs, boundary y politica de adopcion.
      Status: done

- [x] Definir criterios para seleccionar una primera ruta sin asumir un modulo.
      Status: done

## Fase 2. Coexistencia Estructural

- [x] Extraer `LegacyDashboardShell` sin cambios funcionales.
      Status: done

- [x] Implementar boundary central y resolvedor de shell tipado.
      Status: done

- [ ] Implementar `NextDashboardShell` con el contrato aprobado.
      Status: deferred_to_slice_2

- [ ] Validar que la politica vacia conserva el fallback `legacy` y validar rutas legado representativas.
      Status: in_progress

## Fase 3. Primera Adopcion

- [ ] Crear spec o slice para seleccionar y migrar una ruta real.
      Status: pending

- [ ] Registrar la adopcion y validar desktop, movil, scroll y permisos.
      Status: pending

## Fase 4. Retiro Gradual

- [ ] Migrar rutas restantes mediante iniciativas independientes.
      Status: pending

- [ ] Retirar el shell legado cuando no tenga consumidores.
      Status: pending
