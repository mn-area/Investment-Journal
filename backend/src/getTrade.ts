import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda'

const dynamodbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {

    const params: QueryCommandInput = {
        TableName: 'Trades',
        KeyConditionExpression: "isDeleted :false"
    }
    const command = new QueryCommand(params);
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: ''
        })
    }
};