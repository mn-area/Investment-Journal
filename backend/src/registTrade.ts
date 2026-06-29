import { APIGatewayEvent, ProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
    try {

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
