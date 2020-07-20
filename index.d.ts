declare module "@florianbreier/jest-html-reporters" {
    export function addAttach(attach: Buffer | string, description: string);

    export default class {
        public constructor(globalConfig, options);

        public onRunComplete(contexts, results): Promise<void>;
    }
}
