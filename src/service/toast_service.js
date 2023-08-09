import { toast } from "react-toastify";

export function successToast(message) {
    toast.success(message)
}

export function infoToast(message) {
    toast.info(message)
}

export function alertToast(message) {
    toast.error(message)
}