import { fetchFromDB, insertToDB } from "../db";
import { successResponse } from "../responses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { askQuestionInterface, bodyParseQuestionInterface,fetchQuestionInterface } from "../types";
import { verifyUser, findUserId } from "./userLoginSignup";

export const askQuestions = async (event:APIGatewayProxyEvent) => {
  const email : string= await verifyUser(event);
  const userID: number = await findUserId(email);
  const requestBodyParse: bodyParseQuestionInterface = JSON.parse(event.body!);
  const question = requestBodyParse.Question;
  const votes: number = 0;
  const date : Date= new Date();
  const ISToffSet : number= 330; 
  const offset : number = ISToffSet * 60 * 1000;
  const timestamp : Date = new Date(date.getTime() + offset);
  let questionDetails : askQuestionInterface= [[userID, question, votes, timestamp]];
  await insertQuestion(questionDetails);
  return successResponse("Question Successfully posted");
};

export const insertQuestion = async (questionDetails : askQuestionInterface) => {
  const insertQuestionQuery =
    "INSERT INTO Questions (UserID,Question,Votes,Timestamp) VALUES ?";
  return await insertToDB(insertQuestionQuery , questionDetails);
};

export const fetchQuestion = async (questionId : number):Promise<fetchQuestionInterface> => {
  const findQuestionQuery : string=
    "SELECT QuestionID,UserID,Question,Votes,Timestamp FROM Questions WHERE QuestionID=?";
   const findQuestionResult  : fetchQuestionInterface= await fetchFromDB(findQuestionQuery, questionId);
   return findQuestionResult
};

export const viewQuestions = async () => {
  const viewQuestionsQuery : string=
    "SELECT QuestionID,UserID,Question,Votes,Timestamp FROM Questions";
  const questions :fetchQuestionInterface= await fetchFromDB(viewQuestionsQuery, "")
  return successResponse(questions);
};

