import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda'
import { Trade } from './types/trade.types';

const dynamodbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
    const body = event.body ? JSON.parse(event.body) : "";
    const params = {
        TableName: 'Trades',
        Key: {
            tradeId : body.tradeId
        }
    }
    const command = new GetCommand(params);

    try {
        const response = await docClient.send(command);
        const trade = response.Item as Trade | undefined;
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            data : trade,
            message: `success`
        })
    }
    } catch(error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};