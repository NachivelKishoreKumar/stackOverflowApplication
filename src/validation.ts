import { bodyParseInterface, sortValidateInterface } from "./types";

const Joi = require("joi");

let errors: string[] = [];
let validValues: any[]= [];
let flag = false;

export const validateBody = async (requestBody : bodyParseInterface) => {

  const schema = Joi.object({
    Username: Joi.string().pattern(/^[a-z A-Z ]*$/).required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().required(),
  }).options({ abortEarly: false });
  await valid(schema, requestBody);

  if (flag === true) {
    return { type: "errors", value: errors };
  } else {
    return { type: "passed", value: validValues };
  }
};

export const validateSortOptions = async (requestSort : sortValidateInterface) => {

  const schema = Joi.object({
    sortColumnValue: Joi.string().valid("AnswerTimestamp", "Votes"),
    sortValue: Joi.string().valid("asc", "desc").required(),
  }).options({ abortEarly: false });
  await valid(schema, requestSort);

  if (flag === true) {
    return { type: "errors", value: errors };
  } else {
    return { type: "passed", value: validValues };
  }
};

export const validateVote = async (requestVote : {}) => {

  const schema = Joi.object({
    Vote: Joi.string().valid(1, -1).required(),
  }).options({ abortEarly: false });
  await valid(schema, requestVote);

  if (flag === true) {
    return { type: "errors", value: errors };
  } else {
    return { type: "passed", value: validValues };
  }
};
const valid = async (schema , requestBody : bodyParseInterface | sortValidateInterface | {} ) => {
  errors = [];
  let result = await schema.validate(requestBody);
  if (result.error) {
    flag = true;
    errors.push(result.error.details[0].message);
    return;
  } else {
    validValues.push(requestBody);
  }
};
