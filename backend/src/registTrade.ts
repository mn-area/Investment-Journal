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
    const params: PutCommandInput = {
        TableName: 'Trades',
        Item: {
            tradeId: postId,
            tradeDate: '2026-06-20',
            stockName: 20,
            tradeType : 'BUY',
            quantity : 5,
            unitPrice : 100,
            fee : 50,
            reason : 'reason',
            memo : 'memo',
            isDeleted : false,
            createdAt : '2026-07-01T21:16:00',
            updatedAt : '2026-07-01T21:16:00'
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
        message: `Hello`,
        }),
    }
    } catch (error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};
