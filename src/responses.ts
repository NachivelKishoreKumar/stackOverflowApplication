import {  fetchQuestionInterface, fetchSolutionsInterface, viewBookmarkedInterface } from "./types";
import { APIGatewayProxyResult } from "aws-lambda";

export const successResponse = (result : string | viewBookmarkedInterface | fetchQuestionInterface | fetchSolutionsInterface)=> {
  let responsedata  : APIGatewayProxyResult ;
  responsedata = {
    statusCode: 200,
    body : JSON.stringify({message : result})
    
  };
  return responsedata;
};

export const errorResponse = (result : string[] | string) => {
  let responsedata  : APIGatewayProxyResult ;
  responsedata = {
    statusCode: 400,
    body : JSON.stringify({message : result})
  };
  return responsedata;
};
