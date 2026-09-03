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

- [x] Implementar `NextDashboardShell` con el contrato aprobado.
      Status: done

- [x] Validar que el shell nuevo conectado no altera rutas legado con la politica vacia.
      Status: done

## Cierre

- [x] Preparar la coexistencia sin activar rutas productivas en el nuevo shell.
      Status: done

Las adopciones de rutas y el retiro del shell legado pertenecen a specs futuras
con alcance propio.
