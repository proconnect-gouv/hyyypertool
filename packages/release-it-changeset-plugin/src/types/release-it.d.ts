declare module "release-it" {
  export class Plugin {
    static isEnabled(): boolean;
    static disablePlugin(): null;
    namespace: string;
    options: any;
    context: any;
    config: any;
    log: any;
    shell: any;
    spinner: any;
    prompt: any;
    debug: any;
    constructor(options?: {
      namespace?: string;
      options?: any;
      container?: any;
    });
    getInitialOptions(options: any, namespace: string): any;
    init(): any;
    getName(): string;
    getLatestVersion(): string;
    getChangelog(): string;
    getIncrement(): string;
    getIncrementedVersionCI(): string;
    getIncrementedVersion(): string;
    beforeBump(): void | Promise<void>;
    bump(version?: string): void | Promise<void>;
    beforeRelease(): void | Promise<void>;
    release(): void | Promise<void>;
    afterRelease(): void | Promise<void>;
    getContext(path?: string): any;
    setContext(context: any): void;
    exec(command: string, options?: { options?: any; context?: any }): any;
    registerPrompts(prompts: any): void;
    showPrompt(options: any): Promise<any>;
    step(options: any): any;
  }
}
