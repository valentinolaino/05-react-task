import { useState } from "react";
import "./App.css";
import FormularioTarea from "./components/FormularioTarea";
import ListadoTareas from "./components/ListadoTareas";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tareaEditando, setTareaEditando] = useState(null);

  function agregarTarea(tarea) {
    setTareas([...tareas, tarea]);
  }

  function eliminarTarea(index) {
    const nuevasTareas = tareas.filter((_, i) => i !== index);

    setTareas(nuevasTareas);
  }

  function finalizarTarea(index) {
    const nuevasTareas = tareas.map((tarea, i) => {
      if (i === index) {
        return {
          ...tarea,
          estado: "Finalizada",
          fechaCierre: new Date().toISOString().split("T")[0],
        };
      }

      return tarea;
    });

    setTareas(nuevasTareas);
  }

  function editarTarea(index) {
    setTareaEditando(index);
  }

  function actualizarTarea(tareaActualizada) {
    const nuevasTareas = tareas.map((tarea, i) => {
      if (i === tareaEditando) {
        if (tarea.estado === "Finalizada") {
          return {
            ...tarea,
            ...tareaActualizada,
            estado: "Finalizada",
            fechaCierre: tarea.fechaCierre,
          };
        }

        return tareaActualizada;
      }

      return tarea;
    });

    setTareas(nuevasTareas);
    setTareaEditando(null);
  }

  return (
    <>
      <h1>Gestor de Tareas</h1>

      {tareaEditando === null && (
        <FormularioTarea
          onAgregarTarea={agregarTarea}
          tareaEditando={null}
          onActualizarTarea={actualizarTarea}
        />
      )}

      <ListadoTareas
        tareas={tareas}
        tareaEditando={tareaEditando !== null ? tareas[tareaEditando] : null}
        onEliminarTarea={eliminarTarea}
        onFinalizarTarea={finalizarTarea}
        onEditarTarea={editarTarea}
        onActualizarTarea={actualizarTarea}
      />
    </>
  );
}

export default App;
