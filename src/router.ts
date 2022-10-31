import {
  postAnswers,
  viewAllSolutions,
  viewSolution,
} from "./controller/answers";
import {
  addBookmark,
  removeBookmark,
  viewBookmark,
} from "./controller/bookmark";
import { askQuestions, viewQuestions } from "./controller/questions";
import { login, signUp } from "./controller/userLoginSignup";
import { postVote } from "./controller/votes";
import { APIGatewayProxyEvent } from "aws-lambda";

export const router = async (event: APIGatewayProxyEvent) => {
  /*if (requestMethod.httpMethod === "POST" && path === "/signUp") {
    const controllerResponse = await signUp(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "POST" && path === "/login") {
    const controllerResponse = await login(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "POST" && path === "/askQuestion") {
    const controllerResponse = await askQuestions(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "GET" && path === "/viewQuestions") {
    const controllerResponse = viewQuestions();
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "POST" && path === "/postAnswer") {
    const controllerResponse = await postAnswers(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "GET" && path === "/viewAllSolutions") {
    const controllerResponse = viewAllSolutions(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "GET" && path === "/viewSolution") {
    const controllerResponse = viewSolution(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "POST" && path === "/postVote") {
    const controllerResponse = postVote(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "POST" && path === "/addBookmark") {
    const controllerResponse = addBookmark(event);
    return controllerResponse;
  }
  if (requestMethod.httpMethod === "POST" && path === "/removeBookmark") {
    const controllerResponse = removeBookmark(event);
    return controllerResponse;
  }

  if (requestMethod.httpMethod === "GET" && path === "/viewBookmarked") {
    const controllerResponse = viewBookmark(event);
    return controllerResponse;
  }*/

  const routes = {
    GET: {
      "/viewBookmarked": viewBookmark,
      "/viewSolution": viewSolution,
      "/viewAllSolutions": viewAllSolutions,
      "/viewQuestions": viewQuestions,
    },
    POST: {
      "/signUp": signUp,
      "/login": login,
      "/askQuestion": askQuestions,
      "/postAnswer": postAnswers,
      "/postVote": postVote,
      "/addBookmark": addBookmark,
      "/removeBookmark": removeBookmark,
    },
  };

  const callBack = async (callback: (event:APIGatewayProxyEvent) => {},
    event: APIGatewayProxyEvent
  ) => {
    return callback(event);
  };

  const { httpMethod, path } = event;
  const controllerResponse = await callBack(routes[httpMethod][path], event);
  return controllerResponse;
};
