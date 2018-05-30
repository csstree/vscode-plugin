declare module 'csstree-validator' {
    type ReportItemPosition = {
        line: number,
        column: number
    }
    type ReportItemLocation = {
        start: ReportItemPosition,
        end: ReportItemPosition
    }
    type ReportItem = {
        line: number,
        column: number,
        loc?: ReportItemLocation,
        node: {
            loc: ReportItemLocation
        },
        message: string,
        property: string
    };

    export function validateString(source: string): { [name: string]: ReportItem[] }
}