import * as AWS from "aws-sdk";

export class AWSLambdaInvoker {
    private lambda: AWS.Lambda;
    constructor() {
        this.lambda = new AWS.Lambda(); 
    }
    invoke<E, R>(FunctionName: string, Payload: E, ClientContext? : any) : Promise<R> {
        let invkReq: AWS.Lambda.InvocationRequest = {
            FunctionName
            ,InvocationType: "RequestResponse"
            ,LogType: "Tail"
            ,Payload: JSON.stringify(Payload)
        }
        if (ClientContext) invkReq.ClientContext = new Buffer(typeof ClientContext === "string" ? ClientContext : JSON.stringify(ClientContext)).toString("base64");
        return this.lambda.invoke(invkReq).promise()
        .then((res:AWS.Lambda.InvocationResponse) => {
            return JSON.parse(<string>(res.Payload));
        }).then((Payload: any) => {
            if (Payload.errorMessage) {
                try {
                    let err = JSON.parse(<string>(Payload.errorMessage));
                    return Promise.reject(err);
                } catch(e) {
                    return Promise.reject(Payload.errorMessage);
                }
            } else
                return Promise.resolve<R>(Payload);
        });
    }
}

export type AWSLambdaFunctionCallback<R> = (err: any, result?: R) => void;
export type AWSLambdaFunction<E, C, R> = (event: E, context: C, callback: AWSLambdaFunctionCallback<R>) => void;
export type AWSLambdaFunctionHandler<E, C, R> = (event: E, context: C) => Promise<R>;

export function lambda<E, C, R>(handler: AWSLambdaFunctionHandler<E, C, R>) : AWSLambdaFunction<E, C, R> {
    return (event: E, context: C, callback: AWSLambdaFunctionCallback<R>) => {
        handler(event, context)
        .then((result: R) => {
            callback(null, result);
        }).catch((e: any) => {
            callback(typeof e === "string" ? e : JSON.stringify(e));
        });
    };
}