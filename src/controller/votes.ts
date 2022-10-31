import { fetchFromDB, insertToDB, updateDB } from "../db";
import { errorResponse, successResponse } from "../responses";
import { validateVote } from "../validation";
import { APIGatewayProxyEvent } from "aws-lambda";
import { findUserId, verifyUser } from "./userLoginSignup";
import { fetchQuestionInterface, fetchVoteInterface, updateVoteInterface } from "../types";
import { fetchQuestion } from "./questions";

export const postVote = async (event: APIGatewayProxyEvent) => {
  const email: string = await verifyUser(event);
  const userID: number = await findUserId(email);
  const requestBodyParse = JSON.parse(event.body!);
  const questionId: number = requestBodyParse.QuestionID;
  const voteValue: number = requestBodyParse.Vote;
  const voteValidate = { Vote: voteValue };
  const validate = await validateVote(voteValidate);
  if (validate.type === "errors") {
    return errorResponse(validate.value);
  }
  const question : fetchQuestionInterface = await fetchQuestion(questionId);
  if (Object.keys(question).length=== 0) {
    return errorResponse("Question Not Found")
  }
  const voted: fetchVoteInterface = await fetchVote(userID, questionId);
  if (Object.keys(voted).length !== 0) {
    return errorResponse("You have already voted for this Question");
  }
  await insertVote(userID, questionId, voteValue);
  return successResponse("You have voted Successfully");
};

export const fetchVote = async (
  userID: number,
  questionId: number
): Promise<fetchVoteInterface> => {
  const fetchVotes: string = `SELECT UserID,QuestionID,Vote FROM Votes WHERE UserID=${userID} AND QuestionID=${questionId}`;
  return await fetchFromDB(fetchVotes, "");
};

export const insertVote = async (
  userID: number,
  questionId: number,
  voteValue: number
) => {
  const voteDetails: updateVoteInterface = [[userID, questionId, voteValue]];
  const insertVoteQuery: string =
    "INSERT INTO Votes (UserID,QuestionID,Vote) VALUES ?";
  await insertToDB(insertVoteQuery, voteDetails);
  return await updateVote(questionId, voteValue);
};

export const updateVote = async (questionId: number, voteValue: number) => {
  const updateVoteQuery : string = `UPDATE Questions SET Votes = Votes +${voteValue} WHERE QuestionID=${questionId}`;
  return await updateDB(updateVoteQuery);
};
