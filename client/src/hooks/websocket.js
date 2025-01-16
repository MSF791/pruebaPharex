import { useEffect } from "react";
import { notify } from "./modals";

function useNotifications(userId) {
  useEffect(() => {
    if (!userId) return; // No hace nada si `userId` es null o undefined

    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}`);

    socket.onmessage = (event) => {
      const message = event.data;
      setTimeout(() => {
        notify(message)
      }, 1000)
      
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, [userId]); // Vuelve a ejecutar el efecto si cambia `userId`
}

export default useNotifications;
