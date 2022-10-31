import { APIGatewayProxyEvent } from "aws-lambda";
import { errorResponse } from "./responses";
import { router } from "./router";

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  try{
  const eventResponse = await router(event);
  return eventResponse;
  }
  catch{
    return errorResponse("Something Went Wrong")
  }
};
