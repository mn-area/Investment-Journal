import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, ProxyResult } from 'aws-lambda'

const dynamodbClient = new DynamoDBClient({
    region: 'ap-northeast-1',
});

const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
    const date = new Date();
    const isoString = date.toISOString();
    const body = event.body ? JSON.parse(event.body) : "";
    const params = {
        TableName: 'Trades',
        Key: {
            tradeId : body.tradeId
        },
        ExpressionAttributeNames: {
            '#f': 'fee',
            '#m': 'memo',
            '#q': 'quantity',
            '#r': 'reason',
            '#s': 'stockName',
            '#t': 'tradeDate',
            '#u': 'unitPrice'
        },
        ExpressionAttributeValues: {
        ':fee': body.fee,
        ':memo': body.memo,
        ':quantity': body.quantity,
        ':reason': body.reason,
        ':stockName': body.stockName,
        ':tradeDate': body.tradeDate,
        ':unitPrice': body.unitPrice
        },
        UpdateExpression: 'SET #f = :fee, #m = :memo, #q = :quantity, #r = :reason, #s = :stockName, #t = :tradeDate, #u = :unitPrice'
    }
    const command = new UpdateCommand (params);

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
    } catch(error) {
        console.error(`Failed to process order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
};