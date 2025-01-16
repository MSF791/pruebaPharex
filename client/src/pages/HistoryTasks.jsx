import { useEffect, useState } from "react";
import { LoadHistoryTask } from "../api/task";
import { CheckAuth } from "../api/users";

function HistoryTasks() {
  const [user, setUser] = useState();
  const [historyTask, setHistoryTask] = useState([]);

  useEffect(() => {
    async function CheckToken() {
      const token = localStorage.getItem("token");
      const check = await CheckAuth(token);
      setUser(check.data.id);
    }
    CheckToken();
  }, []);

  useEffect(() => {
    async function LoadHistory() {
      const res = await LoadHistoryTask(user);
      setHistoryTask(res.data.tasks_history);
    }
    if (user) {
      LoadHistory();
    }
  }, [user]);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-200 shadow-md p-2 text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Accion</th>
              <th className="px-4 py-2 border">Informacion anterior</th>
              <th className="px-4 py-2 border">Informacion Nueva</th>
              <th className="px-4 py-2 border">Fecha Modificación</th>
            </tr>
          </thead>
          <tbody>
            {historyTask.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  <p className="text-center">
                    No Tienes Actualizaciones en tus tareas
                  </p>
                </td>
              </tr>
            )}
            {historyTask.map((task, index) => (
              <tr key={task.id}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{task.id}</td>
                <td className="px-4 py-2 border">{task.action}</td>
                <td className="px-4 py-2 border">{task.previous_data}</td>
                <td className="px-4 py-2 border">{task.new_data}</td>
                <td className="px-4 py-2 border">{task.modified_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HistoryTasks;
