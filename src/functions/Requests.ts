import axios from "axios";
import { notifications } from "@mantine/notifications";
import { AxiosResponse } from "@/types";

interface PostProps<T> {
    url: string;
    data: Record<string, any>;
    before?: () => void;
    success?: (data: T) => void;
}

class Requests {
    constructor() {}

    async post<T>(props: PostProps<T>): Promise<T | void> {
        props.before?.();

        try {
            // Request and check for success state
            const res = (await axios.post<AxiosResponse<T>>(props.url, props.data)).data;
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

            console.error("Request error: ", err);
        }
    }
}

export default new Requests();
