function Tarea({
  tarea,
  index,
  onEliminarTarea,
  onFinalizarTarea,
  onEditarTarea,
}) {
  return (
    <article>
      <h3>{tarea.nombreProyecto}</h3>

      <p>
        <strong>Tipo:</strong> {tarea.tipoActividad}
      </p>

      <p>
        <strong>Estado:</strong> {tarea.estado}
      </p>

      <p>
        <strong>Prioridad:</strong> {tarea.prioridad}
      </p>

      <p>
        <strong>Resumen:</strong> {tarea.resumen}
      </p>

      <p>
        <strong>Descripción:</strong> {tarea.descripcion}
      </p>

      <p>
        <strong>Informador:</strong> {tarea.informador}
      </p>

      <p>
        <strong>Persona asignada:</strong> {tarea.personaAsignada}
      </p>

      <p>
        <strong>Precondición:</strong> {tarea.precondicion}
      </p>

      <p>
        <strong>Fecha de creación:</strong> {tarea.fechaCreacion}
      </p>

      <p>
        <strong>Fecha de cierre:</strong> {tarea.fechaCierre}
      </p>

      <p>
        <strong>Sprint:</strong> {tarea.sprint}
      </p>

      <button type="button" onClick={() => onEliminarTarea(index)}>
        Eliminar
      </button>

      <button type="button" onClick={() => onFinalizarTarea(index)}>
        Finalizar
      </button>

      <button type="button" onClick={() => onEditarTarea(index)}>
        Editar
      </button>
    </article>
  );
}

export default Tarea;
