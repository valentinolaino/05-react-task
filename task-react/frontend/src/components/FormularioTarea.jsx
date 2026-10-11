import { useState, useEffect } from "react";

function FormularioTarea({ onAgregarTarea, tareaEditando, onActualizarTarea }) {
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [tipoActividad, setTipoActividad] = useState("");
  const [estado, setEstado] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [resumen, setResumen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [informador, setInformador] = useState("");
  const [personaAsignada, setPersonaAsignada] = useState("");
  const [precondicion, setPrecondicion] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [sprint, setSprint] = useState("");

  useEffect(() => {
    if (tareaEditando) {
      setNombreProyecto(tareaEditando.nombreProyecto);
      setTipoActividad(tareaEditando.tipoActividad);
      setEstado(tareaEditando.estado);
      setPrioridad(tareaEditando.prioridad);
      setResumen(tareaEditando.resumen);
      setDescripcion(tareaEditando.descripcion);
      setInformador(tareaEditando.informador);
      setPersonaAsignada(tareaEditando.personaAsignada);
      setPrecondicion(tareaEditando.precondicion);
      setFechaCreacion(tareaEditando.fechaCreacion);
      setFechaCierre(tareaEditando.fechaCierre);
      setSprint(tareaEditando.sprint);
    } else {
      resetForm();
    }
  }, [tareaEditando]);

  function resetForm() {
    setNombreProyecto("");
    setTipoActividad("");
    setEstado("");
    setPrioridad("");
    setResumen("");
    setDescripcion("");
    setInformador("");
    setPersonaAsignada("");
    setPrecondicion("");
    setFechaCreacion("");
    setFechaCierre("");
    setSprint("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !nombreProyecto ||
      !tipoActividad ||
      !estado ||
      !prioridad ||
      !resumen ||
      !descripcion ||
      !informador ||
      !personaAsignada ||
      !fechaCreacion ||
      !sprint
    ) {
      alert("Completá todos los campos obligatorios.");
      return;
    }

    const tarea = {
      nombreProyecto,
      tipoActividad,
      estado,
      resumen,
      descripcion,
      prioridad,
      informador,
      personaAsignada,
      precondicion,
      fechaCreacion,
      fechaCierre,
      sprint,
    };

    if (tareaEditando) {
      onActualizarTarea(tarea);
    } else {
      onAgregarTarea(tarea);
    }
  }

  return (
    <section>
      <h2>{tareaEditando ? "Editar tarea" : "Nueva tarea"}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="nombreProyecto">Nombre del Proyecto</label>

        <input
          type="text"
          id="nombreProyecto"
          value={nombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
          required
        />

        <label htmlFor="tipoActividad">Tipo de Actividad</label>

        <select
          id="tipoActividad"
          value={tipoActividad}
          onChange={(e) => setTipoActividad(e.target.value)}
          required
        >
          <option value="">Seleccionar</option>
          <option value="Tarea">Tarea</option>
          <option value="Historia de Usuario">Historia de Usuario</option>
          <option value="Bug">Bug</option>
          <option value="Mejora">Mejora</option>
        </select>

        <label htmlFor="estado">Estado</label>

        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
          disabled={tareaEditando?.estado === "Finalizada"}
        >
          <option value="">Seleccionar</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Finalizada">Finalizada</option>
        </select>

        <label htmlFor="prioridad">Prioridad</label>

        <select
          id="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          required
        >
          <option value="">Seleccionar</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <label htmlFor="resumen">Resumen</label>

        <input
          type="text"
          id="resumen"
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
        />

        <label htmlFor="descripcion">Descripción</label>

        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <label htmlFor="informador">Informador</label>

        <input
          type="text"
          id="informador"
          value={informador}
          onChange={(e) => setInformador(e.target.value)}
          required
        />

        <label htmlFor="personaAsignada">Persona asignada</label>

        <input
          type="text"
          id="personaAsignada"
          value={personaAsignada}
          onChange={(e) => setPersonaAsignada(e.target.value)}
          required
        />

        <label htmlFor="precondicion">Precondición</label>

        <textarea
          id="precondicion"
          value={precondicion}
          onChange={(e) => setPrecondicion(e.target.value)}
        />

        <label htmlFor="fechaCreacion">Fecha de Creación</label>

        <input
          type="date"
          id="fechaCreacion"
          value={fechaCreacion}
          onChange={(e) => setFechaCreacion(e.target.value)}
          required
        />

        <label htmlFor="fechaCierre">Fecha de Cierre</label>

        <input
          type="date"
          id="fechaCierre"
          value={fechaCierre}
          onChange={(e) => setFechaCierre(e.target.value)}
          disabled={tareaEditando?.estado === "Finalizada"}
        />

        <label htmlFor="sprint">Sprint</label>

        <input
          type="text"
          id="sprint"
          value={sprint}
          onChange={(e) => setSprint(e.target.value)}
          required
        />

        <button type="submit">
          {tareaEditando ? "Guardar cambios" : "Crear tarea"}
        </button>
      </form>
    </section>
  );
}

export default FormularioTarea;
