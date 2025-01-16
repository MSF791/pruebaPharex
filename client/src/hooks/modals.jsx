import toast from "react-hot-toast";

export const success = (message) => toast.success(message);

export const load = (message) => toast.loading(message);

export const errorModal = (message) => toast.error(message);

export const closeModal = () => toast.dismiss();

export const notify = (message) => toast(message, {
  duration:6000
});
