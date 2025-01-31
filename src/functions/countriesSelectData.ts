import { countries } from "countries-list";

export const countriesSelectData = (): { value: string; label: string }[] => {
    return Object.entries(countries).map(([code, country]) => {
        return {
            value: code,
            label: country.name,
        };
    });
};
