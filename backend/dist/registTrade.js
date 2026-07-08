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
    const date = new Date();
    const isoString = date.toISOString();
    const body = event.body ? JSON.parse(event.body) : "";
    const params = {
        TableName: 'Trades',
        Item: {
            tradeId: postId,
            tradeDate: body.tradeDate,
            stockName: body.stockName,
            tradeType: body.tradeType,
            quantity: body.quantity,
            unitPrice: body.unitPrice,
            fee: body.fee,
            reason: body.reason,
            memo: body.memo,
            createdAt: isoString,
            updatedAt: isoString
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
                message: `success`,
            }),
        };
    }
    catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
exports.handler = handler;
