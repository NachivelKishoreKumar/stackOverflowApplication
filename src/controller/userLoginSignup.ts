import { fetchFromDB, insertToDB } from "../db";
import { APIGatewayProxyEvent } from "aws-lambda";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { validateBody } from "../validation";
import { errorResponse, successResponse } from "../responses";
import {
  bodyParseInterface,
  fetchPasswordInterface,
  fetchUserInterface,
  findUserIDInterface,
  userSignupInterface,
  validateInterface,
} from "../types";

export const getHash = async (password: string) => {
  let hash = crypto.createHash("md5");
  let data = hash.update(password, "utf-8");
  let genhash: string = data.digest("hex");

  return genhash;
};

export const signUp = async (event: APIGatewayProxyEvent) => {
  const requestBodyParse: bodyParseInterface = JSON.parse(event.body!);

  const encryptedPassword: string = await getHash(requestBodyParse.Password);
  const username : string = requestBodyParse.Username;
  const email : string= requestBodyParse.Email;
  const userDetails: userSignupInterface = [
    [username, email, encryptedPassword],
  ];
  const userValidate: bodyParseInterface = {
    Username: requestBodyParse.Username,
    Email: requestBodyParse.Email,
    Password: encryptedPassword,
  };
  const validate: validateInterface = await validateBody(userValidate);
  if (validate.type === "errors") {
    return errorResponse(validate.value);
  } else {
    await insertUser(userDetails);
    return successResponse("Signup Successful");
  }
};

export const insertUser = async (userDetails: userSignupInterface) => {
  const insertQuery = "INSERT INTO Users (Username,Email,Password) VALUES ?";

  return await insertToDB(insertQuery, userDetails);
};

export const login = async (event: APIGatewayProxyEvent) => {
  const jwt_secret_key: string = process.env.jwt_secret_key!;
  const requestBodyParse: bodyParseInterface = JSON.parse(event.body!);

  const user: fetchPasswordInterface = await fetchPassword(
    requestBodyParse.Email
  );

  if (user !== null) {
    let encryptedPasswordfromDB: string = user[0].Password;
    const encryptedPassword: string = await getHash(requestBodyParse.Password);

    if (encryptedPasswordfromDB === encryptedPassword) {
      const accessToken: string = await generateAccessToken(
        requestBodyParse.Email,
        jwt_secret_key
      );
      return successResponse(accessToken);
    } else {
      return errorResponse("Incorrect Password");
    }
  } else {
    return errorResponse("Not a Registered User");
  }
};

export const generateAccessToken = async (
  email: string,
  jwt_secret_key: string
) => {
  return jwt.sign(email, jwt_secret_key);
};

export const fetchPassword = async (
  email: string
): Promise<fetchPasswordInterface> => {
  const findUserQuery = "SELECT Password from Users WHERE Email=?";
  const user : fetchPasswordInterface= await fetchFromDB(findUserQuery, email);
  return user;
};

export const verifyUser = async (event: APIGatewayProxyEvent):Promise<string> => {
  const jwt_secret_key: string = process.env.jwt_secret_key!;
  const bearerHeader: string | undefined= event.headers.Authorization;
  if (typeof bearerHeader !== "undefined") {
    const bearerToken: string = bearerHeader.split(" ")[1];
    const email: string = jwt.verify(bearerToken, jwt_secret_key);
    return await fetchUser(email) as string;
  }
  return '';
};

export const fetchUser = async (email: string)=> {
  const findUserQuery: string =
    "SELECT Username,UserID,Email from Users WHERE Email=?";
  const user: fetchUserInterface = await fetchFromDB(findUserQuery, email);
  if (user !== null) {
    return email;
  }
};

export const findUserId = async (email: string)  : Promise<number>=> {
  const findUserQuery: string = `Select UserID from Users WHERE Email="${email}"`;
  const userId : findUserIDInterface= await fetchFromDB(findUserQuery, "")
  return userId[0].UserID;
};
