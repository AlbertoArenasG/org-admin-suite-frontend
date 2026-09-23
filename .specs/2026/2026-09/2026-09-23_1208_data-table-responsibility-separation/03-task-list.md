# Task List: DataTable Responsibility Separation

- [x] Cerrar contratos y utilidades puras del catalogo `data-table`.
      Status: done
      Dependency: definicion tecnica aprobada.
      Closure: tipos, labels, highlight y calculo de paginas se separan sin
      cambiar el barrel ni la API publica.
- [ ] Separar superficies superiores y region de resultados sin alterar su
      comportamiento.
      Status: pending
      Dependency: contratos y utilidades separados.
      Closure: chrome, settings, region scrollable y paginacion se componen
      fuera del coordinador y conservan sus visuales e interacciones.
- [ ] Separar tabla semantica, recomponer el coordinador y validar todos los
      consumidores actuales.
      Status: pending
      Dependency: superficies superiores y region de resultados separadas.
      Closure: encabezados y cuerpo viven en artefactos cohesionados;
      `DataTable` conserva TanStack y efectos sin convertirse en otro
      coordinador gigante.
- [ ] Actualizar documentacion viva y cerrar evidencia de validacion.
      Status: pending
      Dependency: refactorizacion completa y validada tecnicamente.
      Closure: guia viva, progreso y matriz manual reflejan la estructura
      final y la evidencia de no regresion.
