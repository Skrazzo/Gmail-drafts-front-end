export default function stringTagsToArray(str: string): number[] {
    if (!str) return [];

    return str
        .toString()
        .split(",")
        .map(Number)
        .filter((id) => id);
}
