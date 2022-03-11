/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(dummyData),
    };
};


const dummyData = {
    recipies: [
        {
            name: "toast",
            ingredients: {
                list: [
                    {
                        index: 0,
                        name: "bread",
                        quantity: {
                            value: 1,
                            unit: 'slice'
                        }
                    }
                ]
            }
        },
        {
            name: "Ham",
            ingredients: {
                list: []
            }
        },
        {
            name: "Bread",
            ingredients: {
                list: []
            }
        },
        {
            name: "Steak",
            ingredients: {
                list: []
            }
        },
        {
            name: "Lamb",
            ingredients: {
                list: []
            }
        },
        {
            name: "Hummus",
            ingredients: {
                list: []
            }
        },
        {
            name: "Gravy",
            ingredients: {
                list: []
            }
        },
    ]
  }
  