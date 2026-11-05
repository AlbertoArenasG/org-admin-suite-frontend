# Decisiones

- El diálogo existente de envío se compone como formulario corto de una sección. No se amplía `Dialog` genérico ni se usa wizard de pasos ficticios. Para formularios extensos se usa `ResourceFormRoute`; otros diálogos breves pueden componer primitives sin cambiar un contrato global.
- Las indicaciones se precargan mediante lectura de detalle al abrir desde tabla. El PATCH de estado y el PATCH de indicaciones son operaciones diferentes.
- Redux Toolkit posee datos remotos y estados de request; React local posee borradores y overlays. No se duplica el recurso en Zustand.
- Se reutiliza `CustomerServiceRecordDocumentForm` para orden de compra y complementos; las acciones especializadas permanecen en el módulo de facturación.
- La visibilidad de comentarios EXTERNAL solo se almacena; el portal cliente queda intacto.
