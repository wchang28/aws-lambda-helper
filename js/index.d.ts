export declare class AWSLambdaInvoker {
    private lambda;
    constructor();
    invoke<E, R>(FunctionName: string, Payload: E, ClientContext?: any): Promise<R>;
}
export declare type AWSLambdaFunctionCallback<R> = (err: any, result?: R) => void;
export declare type AWSLambdaFunction<E, C, R> = (event: E, context: C, callback: AWSLambdaFunctionCallback<R>) => void;
export declare type AWSLambdaFunctionHandler<E, C, R> = (event: E, context: C) => Promise<R>;
export declare function factory<E, C, R>(handler: AWSLambdaFunctionHandler<E, C, R>): AWSLambdaFunction<E, C, R>;
