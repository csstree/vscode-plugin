declare module 'csstree-validator' {
    type Position = {
        offset: number;
        line: number;
        column: number;
    }

    type Entry = {
        message: string;
        offset: number;
        line: number;
        column: number;
        loc?: {
            source: string;
            start: Position;
            end: Position;
        }
    }

    function validate(css: string, filename?: string): Entry[];
}
