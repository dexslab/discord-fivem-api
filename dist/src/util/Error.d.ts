/**
 * Creates a custom error class that extends a base error class (Error or TypeError).
 *
 * @param {Error} [ErrorBase= Error] - The base error class to extend (default is the built-in Error).
 * @returns {class} - A custom error class with enhanced functionality.
 */
declare function createErrorMessage(ErrorBase?: ErrorConstructor): {
    new (key: any, ...args: any[]): {
        /**
         * Getter for the error name, including the custom error code.
         * @returns {string} - The formatted error name with the error code.
         */
        get name(): string;
        /**
         * Getter for the error code.
         * @returns {string} - The error code assigned to the instance.
         */
        readonly code: any;
        /**
         * Overrides the default toString method to include the error code.
         * @returns {string} - The string representation of the error with the custom code.
         */
        toString(): string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
declare const DfaError: {
    new (key: any, ...args: any[]): {
        /**
         * Getter for the error name, including the custom error code.
         * @returns {string} - The formatted error name with the error code.
         */
        get name(): string;
        /**
         * Getter for the error code.
         * @returns {string} - The error code assigned to the instance.
         */
        readonly code: any;
        /**
         * Overrides the default toString method to include the error code.
         * @returns {string} - The string representation of the error with the custom code.
         */
        toString(): string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
declare const DfaTypeError: {
    new (key: any, ...args: any[]): {
        /**
         * Getter for the error name, including the custom error code.
         * @returns {string} - The formatted error name with the error code.
         */
        get name(): string;
        /**
         * Getter for the error code.
         * @returns {string} - The error code assigned to the instance.
         */
        readonly code: any;
        /**
         * Overrides the default toString method to include the error code.
         * @returns {string} - The string representation of the error with the custom code.
         */
        toString(): string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export { createErrorMessage, DfaError, DfaTypeError, };
//# sourceMappingURL=Error.d.ts.map