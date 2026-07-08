import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand  } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda'

const dynamodbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {

    const params = {
        TableName: 'Trades',
    }
    const command = new ScanCommand(params);

    try {
        const response = await docClient.send(command);
    return {
        statusCode: 200,
        body: JSON.stringify({
            data : response,
            message: ''
        })
    }
    } catch(error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};