"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamodbClient = new client_dynamodb_1.DynamoDBClient({
    region: 'ap-northeast-1',
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamodbClient);
const handler = async (event) => {
    const body = event.body ? JSON.parse(event.body) : "";
    const params = {
        TableName: 'Trades',
        Key: {
            tradeId: body.tradeId
        }
    };
    const command = new lib_dynamodb_1.GetCommand(params);
    try {
        const response = await docClient.send(command);
        const trade = response.Item;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                data: trade,
                message: `success`
            })
        };
    }
    catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
exports.handler = handler;
