import { fetchFromDB, insertToDB } from "../db";
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { errorResponse, successResponse } from "../responses";
import { validateSortOptions } from "../validation";
import { fetchQuestion } from "./questions";
import { findUserId, verifyUser } from "./userLoginSignup";
import { fetchQuestionInterface, fetchSolutionsInterface, postAnswersInterface, sortValidateInterface } from "../types";

export const postAnswers = async (event:APIGatewayProxyEvent) => {
  const email = await verifyUser(event) as string;
  const userID : number = await findUserId(email);
  const requestBodyParse = JSON.parse(event.body!);
  const questionId : number = requestBodyParse.QuestionID;

  const question = await fetchQuestion(questionId) as fetchQuestionInterface;
  if (Object.keys(question).length === 0) {
    return errorResponse("Question Not Found")
  }
  const date : Date= new Date();
  const ISToffSet : number= 330; 
  const offset : number = ISToffSet * 60 * 1000;
  const timestamp : Date = new Date(date.getTime() + offset);
  const questionID : number = question[0].QuestionID;
  const answer : string = requestBodyParse.Answer;
  const answerDetails : postAnswersInterface= [[userID, questionID, answer, timestamp]];
  await insertAnswer(answerDetails);
  return successResponse("Answer Posted")
};

export const insertAnswer = async (answerDetails : postAnswersInterface) => {
  const insertAnswerQuery : string =
    "INSERT INTO Answers (UserID,QuestionID,Answer,Timestamp) VALUES ?";
  return await insertToDB(insertAnswerQuery, answerDetails);
};

export const viewAllSolutions = async (event:APIGatewayProxyEvent) => {
  const params = event.queryStringParameters;
  const sortColumn :string = params?.sortColumn || "Votes";
  const sort : string = params?.sort || "desc";
  const sortValidate : sortValidateInterface= { sortColumnValue: sortColumn, sortValue: sort };
  const validate = await validateSortOptions(sortValidate);
  if (validate.type === "errors") {
    return errorResponse(validate.value)
  }
  const solutions = await fetchAllSolutions(sortColumn, sort);
  return successResponse(solutions)
};

export const fetchAllSolutions = async (sortColumn : string, sort : string) : Promise<fetchSolutionsInterface>=> {
  const viewSolutions = `SELECT Questions.UserID AS QuestionerID ,Questions.QuestionID,Questions.Question,Questions.Votes,Questions.Timestamp AS QuestionTimestamp, Answers.UserID AS AnwererID,Answers.AnswerID,Answers.Answer,Answers.Timestamp AS AnswerTimestamp FROM Questions INNER JOIN Answers ON Questions.QuestionID=Answers.QuestionID ORDER BY ${sortColumn} ${sort}`;
  const solutions : fetchSolutionsInterface = await fetchFromDB(viewSolutions, "");
  return solutions;
};

export const viewSolution = async (event : APIGatewayProxyEvent) => {
  const requestBodyParse = JSON.parse(event.body!);
  const params = event.queryStringParameters;
  let sortColumn = params?.sortColumn || "AnswerTimestamp";
  let sort = params?.sort || "desc";
  const questionId : number = requestBodyParse.QuestionID;
  const sortValidate : sortValidateInterface= { sortColumnValue: sortColumn, sortValue: sort };
  const validate = await validateSortOptions(sortValidate);
  if (validate.type === "errors") {
    return errorResponse(validate.value)
  }
  const question : fetchQuestionInterface = await fetchQuestion(questionId);
  if (Object.keys(question).length=== 0) {
    return errorResponse("Question Not Found")
  }
  const solutions = await fetchSolution(questionId, sortColumn, sort);
  return successResponse(solutions)
};

export const fetchSolution = async (questionId : number, sortColumn : string, sort : string) : Promise<fetchSolutionsInterface>=> {
  const viewSolutions : string = `SELECT Questions.UserID AS QuestionerID,Questions.QuestionID,Questions.Question,Questions.Votes,Questions.Timestamp AS QuestionTimestamp, Answers.UserID AS AnwererID,Answers.AnswerID,Answers.Answer,Answers.Timestamp AS AnswerTimestamp FROM Questions INNER JOIN Answers ON Questions.QuestionID=Answers.QuestionID AND Questions.QuestionID=? ORDER BY ${sortColumn} ${sort}`;
  const solutions : fetchSolutionsInterface = await fetchFromDB(viewSolutions, questionId);
  return solutions;
};
