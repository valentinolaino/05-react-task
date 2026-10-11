import { Fragment, useState } from "react";
import Tarea from "./Tarea";
import FormularioTarea from "./FormularioTarea";

function ListadoTareas({
  tareas,
  tareaEditando,
  onEliminarTarea,
  onFinalizarTarea,
  onEditarTarea,
  onActualizarTarea,
}) {
  const [filtro, setFiltro] = useState("Todas");

  const tareasFiltradas =
    filtro === "Todas"
      ? tareas
      : tareas.filter((tarea) => {
          if (filtro === "Pendientes") {
            return tarea.estado === "Pendiente";
          }

          if (filtro === "En progreso") {
            return tarea.estado === "En progreso";
          }

          if (filtro === "Finalizadas") {
            return tarea.estado === "Finalizada";
          }

          return true;
        });

  const cantidades = {
    Todas: tareas.length,
    Pendientes: tareas.filter((t) => t.estado === "Pendiente").length,
    "En progreso": tareas.filter((t) => t.estado === "En progreso").length,
    Finalizadas: tareas.filter((t) => t.estado === "Finalizada").length,
  };

  // La tarea en edición siempre se muestra, aunque no entre en el filtro.
  // Si no, su panel desaparecería y no se podrían guardar los cambios.
  const tareasVisibles =
    tareaEditando && !tareasFiltradas.includes(tareaEditando)
      ? [...tareasFiltradas, tareaEditando]
      : tareasFiltradas;

  return (
    <section>
      <h2>Ver tareas</h2>

      <div className="filtros-tareas">
        {["Todas", "Pendientes", "En progreso", "Finalizadas"].map((opcion) => (
          <button
            key={opcion}
            type="button"
            className={filtro === opcion ? "filtro activo" : "filtro"}
            onClick={() => setFiltro(opcion)}
          >
            {opcion} ({cantidades[opcion]})
          </button>
        ))}
      </div>

      {tareasVisibles.length === 0 ? (
        <p>No hay tareas para este filtro.</p>
      ) : (
        tareasVisibles.map((tarea) => {
          const index = tareas.indexOf(tarea);

          return (
            <Fragment key={index}>
              <Tarea
                tarea={tarea}
                index={index}
                onEliminarTarea={onEliminarTarea}
                onFinalizarTarea={onFinalizarTarea}
                onEditarTarea={onEditarTarea}
              />

              {tareaEditando === tarea && (
                <FormularioTarea
                  onAgregarTarea={() => {}}
                  tareaEditando={tarea}
                  onActualizarTarea={onActualizarTarea}
                />
              )}
            </Fragment>
          );
        })
      )}
    </section>
  );
}

export default ListadoTareas;
