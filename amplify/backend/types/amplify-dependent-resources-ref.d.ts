export type AmplifyDependentResourcesAttributes = {
    "function": {
        "getRecipies": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "auth": {
        "recipies": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "recipiesAPI": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}