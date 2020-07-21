declare module "@florianbreier/jest-html-reporters" {
    export function addAttach(attach: Buffer | string, description: string, testPath?: string, testName?: string);

    export default class {
        public constructor(globalConfig, options);

        public onRunComplete(contexts, results): Promise<void>;
    }
}
