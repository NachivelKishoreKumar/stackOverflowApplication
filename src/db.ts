import mysql from "mysql2";
import { askQuestionInterface, postAnswersInterface, updateVoteInterface, userSignupInterface } from "./types";

export const dbConnect = () => {
  const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });
  connection.connect(function (error) {
    if (error) {
      return;
    }
  });
  return connection;
};

export const insertToDB = async(Query:string,Details : postAnswersInterface | askQuestionInterface | updateVoteInterface | userSignupInterface) :Promise<any>=> {
    return await new Promise(async (resolve, reject) => {
       const connection = dbConnect();
       connection.query(Query,[Details],(error, results) => {
         if (error) {
           reject(error.message);
           connection.end();
         } else {
           resolve(results);
           connection.end();
         }
       });
     });
   };

   export const fetchFromDB= async(Query:string,Details : number | string ) :Promise<any>=> {
    return await new Promise(async (resolve, reject) => {
       const connection = dbConnect();
       connection.query(Query,Details,(error, results) => {
         if (error) {
           reject(error.message);
           connection.end();
         } else {
           resolve(results);
           connection.end();
         }
       });
     });
   };

   export const updateDB = async(Query: string) => {
    return await new Promise(async (resolve, reject) => {
       const connection = dbConnect();
       connection.query(Query,(error, results) => {
         if (error) {
           reject(error.message);
           connection.end();
         } else {
           resolve(results);
           connection.end();
         }
       });
     });
   };

   export const deleteFromDB= async(Query: string) => {
    return await new Promise(async (resolve, reject) => {
       const connection = dbConnect();
       connection.query(Query,(error, results) => {
         if (error) {
           reject(error.message);
           connection.end();
         } else {
           resolve(results);
           connection.end();
         }
       });
     });
   };