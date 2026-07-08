import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda'
import { v7 as uuidv7 } from 'uuid';

const dynamodbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
    const postId = uuidv7();
    const date = new Date();
    const isoString = date.toISOString();
    const body = event.body ? JSON.parse(event.body) : "";

    const params: PutCommandInput = {
        TableName: 'Trades',
        Item: {
            tradeId: postId,
            tradeDate: body.tradeDate,
            stockName: body.stockName,
            tradeType : body.tradeType,
            quantity : body.quantity,
            unitPrice : body.unitPrice,
            fee : body.fee,
            reason : body.reason,
            memo : body.memo,
            createdAt : isoString,
            updatedAt : isoString
        },
    };

    const command = new PutCommand(params);
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
    }
    } catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
