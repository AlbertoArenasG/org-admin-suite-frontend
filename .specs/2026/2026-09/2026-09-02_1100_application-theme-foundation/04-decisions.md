# Decisions

## 2026-09-02

### Tema como composición completa

Un tema futuro resuelve todas las capas de la aplicación: Navigation Shell, Content
Inset, Workspace Canvas, superficies, controles, estados, popovers y MUI. La primera
implementación conserva contenido claro en ambos temas para no alterar módulos legacy.

### Tokens antes de la migración

Todo componente nuevo o reestructurado debe consumir tokens semánticos desde ahora. La
migración no se tratará como un refactor temático masivo al finalizar.

### Compatibilidad legacy

Compatibilidad significa conservar tokens base y valores actuales para rutas existentes.
No autoriza editar componentes legacy fuera del alcance de una migración de vista aprobada.
