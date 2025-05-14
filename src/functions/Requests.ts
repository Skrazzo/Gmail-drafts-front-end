import axios from "axios";
import { notifications } from "@mantine/notifications";
import { AxiosResponse } from "@/types";

interface RequestProps<T> {
    url: string;
    headers?: Record<string, any>;
    before?: () => void;
    finally?: () => void;
    success?: (data: T) => void;
    error?: (data: string) => void;
}

interface PostProps<T> extends RequestProps<T> {
    data: Record<string, any>;
}

interface GetProps<T> extends RequestProps<T> {
    params?: Record<string, any>;
}

// New interface for DELETE requests
interface DeleteProps<T> extends RequestProps<T> {
    params?: Record<string, any>; // DELETE can also have parameters in the URL
}

class Requests {
    constructor() {}

    async get<T>(props: GetProps<T>): Promise<T | void> {
        props.before?.();
        try {
            // Request and check for success state
            const res = (
                await axios.get<AxiosResponse<T>>(props.url, {
                    params: props.params || {},
                    headers: props.headers || {},
                })
            ).data;
            if (res.success) {
                props.success?.(res.data);
                return res.data;
            } else {
                // Report backend error
                throw new Error(res.error);
            }
        } catch (err) {
            // Report error to front end
            notifications.show({
                title: "Request error",
                message: (err as Error).message,
                color: "red",
            });

            console.error(`Request error: ${err} for ${props.url}`);
            props.error?.((err as Error).message);
        } finally {
            props.finally?.();
        }
    }

    async post<T>(props: PostProps<T>): Promise<T | void> {
        props.before?.();

        try {
            // Request and check for success state
            const res = (
                await axios.post<AxiosResponse<T>>(props.url, props.data, {
                    headers: props.headers || {},
                })
            ).data;

            if (res.success) {
                props.success?.(res.data);
                return res.data;
            } else {
                // Report backend error
                throw new Error(res.error);
            }
        } catch (err) {
            // Report error to front end
            notifications.show({
                title: "Request error",
                message: (err as Error).message,
                color: "red",
            });

            console.error(`Request error: ${err} for ${props.url}`);
            props.error?.((err as Error).message);
        } finally {
            props.finally?.();
        }
    }

    // New delete method
    async delete<T>(props: DeleteProps<T>): Promise<T | void> {
        props.before?.();
        try {
            // Request and check for success state
            const res = (
                await axios.delete<AxiosResponse<T>>(props.url, {
                    params: props.params || {}, // DELETE can have parameters
                    headers: props.headers || {},
                })
            ).data;

            if (res.success) {
                props.success?.(res.data);
                return res.data;
            } else {
                // Report backend error
                throw new Error(res.error);
            }
        } catch (err) {
            // Report error to front end
            notifications.show({
                title: "Request error",
                message: (err as Error).message,
                color: "red",
            });

            console.error(`Request error: ${err} for ${props.url}`);
            props.error?.((err as Error).message);
        } finally {
            props.finally?.();
        }
    }
}

export default new Requests();
