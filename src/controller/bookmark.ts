import { deleteFromDB, fetchFromDB, insertToDB } from "../db";
import { errorResponse, successResponse } from "../responses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { fetchQuestion } from "./questions";
import { findUserId, verifyUser } from "./userLoginSignup";
import { fetchBookmarkInterface, fetchQuestionInterface, insertBookmarkInterface, viewBookmarkedInterface } from "../types";

export const addBookmark = async (event:APIGatewayProxyEvent) => {
  const email : string = await verifyUser(event);
  const userID : number= await findUserId(email);
  const requestBodyParse = JSON.parse(event.body!);
  const questionId : number= requestBodyParse.QuestionID;
  const bookmarked : fetchBookmarkInterface= await fetchBookmark(userID, questionId);
  const bookmarkDetails  : insertBookmarkInterface= [[userID, questionId]];
  const question : fetchQuestionInterface = await fetchQuestion(questionId);
  if (Object.keys(question).length=== 0) {
    return errorResponse("Question Not Found")
  }
  if (Object.keys(bookmarked).length !== 0) {
    return errorResponse("Question is already Bookmarked")
  }
  await insertBookmark(bookmarkDetails);
  return successResponse("Question Bookmarked")
};

export const fetchBookmark = async (userID : number, questionId : number) : Promise<fetchBookmarkInterface>=> {
  const fetchBookmarkQuery : string= `SELECT UserID,QuestionID FROM Bookmarks WHERE UserID=${userID} AND QuestionID=${questionId}`;
  return await fetchFromDB(fetchBookmarkQuery, "");
};

export const insertBookmark = async (bookmarkDetails) => {
  const insertBookmarkQuery : string = `INSERT INTO Bookmarks (UserID,QuestionID) VALUES ?`;
  return await insertToDB(insertBookmarkQuery, bookmarkDetails);
};

export const removeBookmark = async (event : APIGatewayProxyEvent) => {
  const email = await verifyUser(event) as string;
  const userID : number= await findUserId(email);
  const requestBodyParse = JSON.parse(event.body!);
  const questionId : number= requestBodyParse.QuestionID;
  const bookmarked : fetchBookmarkInterface= await fetchBookmark(userID, questionId);
  const question : fetchQuestionInterface = await fetchQuestion(questionId);
  if (Object.keys(question).length === 0) {
    return errorResponse("Question Not Found")
  }
  if (Object.keys(bookmarked).length !== 1) {
    return errorResponse("Question is not Bookmarked")
  }
  await deleteBookmark(userID, questionId);
  return successResponse("Question removed from Bookmarked")
};

export const deleteBookmark = async (userID : number, questionId : number) => {
  const deleteBookmarkQuery : string = `DELETE FROM Bookmarks WHERE UserID=${userID} AND QuestionID=${questionId}`;
  return await deleteFromDB(deleteBookmarkQuery);
};

export const viewBookmark = async (event:APIGatewayProxyEvent) => {
  const email = await verifyUser(event) as string;
  const userID : number= await findUserId(email);
  const viewBookmarkedQuery : string= `SELECT Questions.QuestionID,Questions.Question FROM Questions INNER JOIN Bookmarks ON Questions.QuestionID = Bookmarks.QuestionID AND Bookmarks.UserID="${userID}"`;
  const bookmarkedQuestions : viewBookmarkedInterface = await fetchFromDB(viewBookmarkedQuery, email);
  return successResponse(bookmarkedQuestions)
};
