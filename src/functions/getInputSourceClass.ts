export default function getInputSourceClass(inputSource: string | undefined, comboBox: boolean = false): string {
    if (inputSource === undefined) return "";

    if (inputSource === "manual") {
        let rtn = "manual-" + (comboBox ? "comboBox" : "input");
        return rtn;
    } else if (inputSource === "excel") {
        let rtn = "excel-" + (comboBox ? "comboBox" : "input");
        return rtn;
    } else {
        return "";
    }
}
