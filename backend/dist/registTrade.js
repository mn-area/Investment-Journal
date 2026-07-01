"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const dynamodbClient = new client_dynamodb_1.DynamoDBClient({
    region: 'ap-northeast-1',
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamodbClient);
const handler = async (event) => {
    const postId = (0, uuid_1.v7)();
    const params = {
        TableName: 'Trades',
        Item: {
            tradeId: postId,
            tradeDate: '2026-06-20',
            stockName: 20,
            tradeType: 'BUY',
            quantity: 5,
            unitPrice: 100,
            fee: 50,
            reason: 'reason',
            memo: 'memo',
            isDeleted: false,
            createdAt: '2026-07-01T21:16:00',
            updatedAt: '2026-07-01T21:16:00'
        },
    };
    const command = new lib_dynamodb_1.PutCommand(params);
    try {
        await docClient.send(command);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: `Hello`,
            }),
        };
    }
    catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
exports.handler = handler;
