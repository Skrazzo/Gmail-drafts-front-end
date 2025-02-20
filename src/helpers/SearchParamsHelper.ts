import { DateValue } from "@mantine/dates";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

export default class SearchParamsHelper {
    searchParams;
    setSearchParams;
    idsSeparator = "-";
    dateFormat = "YYYY-MM-DD";

    constructor() {
        [this.searchParams, this.setSearchParams] = useSearchParams();
    }

    get(paramName: string): string {
        return this.searchParams.get(paramName) || "";
    }

    set(paramName: string, value: string) {
        this.setSearchParams({
            ...Object.fromEntries(this.searchParams),
            [paramName]: value,
        });
    }

    delete(paramName: string) {
        let data = Object.fromEntries(this.searchParams);
        delete data[paramName];
        this.setSearchParams(data);
    }

    getBoolean(paramName: string): boolean {
        return this.get(paramName) === "1";
    }

    setBoolean(paramName: string, value: boolean) {
        this.set(paramName, value ? "1" : "0");
    }

    getIds(paramName: string): number[] {
        const ids = this.get(paramName);
        if (!ids) return [];
        return ids
            .split(this.idsSeparator)
            .map(Number)
            .filter((id) => !isNaN(id));
    }

    setIds(paramName: string, ids: number[]) {
        this.set(paramName, ids.join(this.idsSeparator));
    }

    setDate(paramName: string, date: Date | DateValue | null) {
        if (date === null) {
            // Delete if deselected
            this.delete(paramName);
        } else {
            // Add date to the search params
            this.set(paramName, dayjs(date).format(this.dateFormat));
        }
    }
}
