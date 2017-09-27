"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var AWSLambdaInvoker = /** @class */ (function () {
    function AWSLambdaInvoker() {
        this.lambda = new AWS.Lambda();
    }
    AWSLambdaInvoker.prototype.invoke = function (FunctionName, Payload, ClientContext) {
        var invkReq = {
            FunctionName: FunctionName,
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: JSON.stringify(Payload)
        };
        if (ClientContext)
            invkReq.ClientContext = new Buffer(typeof ClientContext === "string" ? ClientContext : JSON.stringify(ClientContext)).toString("base64");
        return this.lambda.invoke(invkReq).promise()
            .then(function (res) {
            return JSON.parse((res.Payload));
        }).then(function (Payload) {
            if (Payload.errorMessage) {
                try {
                    var err = JSON.parse((Payload.errorMessage));
                    return Promise.reject(err);
                }
                catch (e) {
                    return Promise.reject(Payload.errorMessage);
                }
            }
            else
                return Promise.resolve(Payload);
        });
    };
    return AWSLambdaInvoker;
}());
exports.AWSLambdaInvoker = AWSLambdaInvoker;
function AWSLambdaFunction(handler) {
    return function (event, context, callback) {
        handler(event, context)
            .then(function (result) {
            callback(null, result);
        }).catch(function (e) {
            callback(typeof e === "string" ? e : JSON.stringify(e));
        });
    };
}
exports.AWSLambdaFunction = AWSLambdaFunction;
//# sourceMappingURL=index.js.map