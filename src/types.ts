export interface bodyParseInterface {
  Username: string;
  Email: string;
  Password: string;
}

export interface fetchPasswordInterface {
  [index: number]: { Password: string };
}

export interface fetchUserInterface {
  [index: number]: { Username: string; UserID: number; Email: string };
}

export interface findUserIDInterface {
  [index: number]: { UserID: number };
}

export interface validateInterface {
  type: string;
  value: string[];
}

export interface bodyParseQuestionInterface {
  Question: string;
}

export interface askQuestionInterface {
  [index: number]: [
    userID: number,
    question: string,
    votes: number,
    timestamp: Date
  ];
}

export interface fetchQuestionInterface {
  [index: number]: {
    QuestionID: number;
    UserID: number;
    Question: string;
    Votes: number;
    Timestamp: Date;
  };
}

export interface postAnswersInterface {
  [index: number]: [
    userID: number,
    questionID: number,
    answer: string,
    timestamp: Date
  ];
}

export interface fetchSolutionsInterface {
  [index: number]: [
    QuestionerID: number,
    QuestionID: number,
    Question: string,
    Votes: number,
    QuestionTimestamp: Date,
    AnswererID: number,
    AnswerID: number,
    Answer: string,
    AnswerTimestamp: Date
  ];
}

export interface sortValidateInterface {
  sortColumnValue: string;
  sortValue: string;
}

export interface fetchVoteInterface {
  [index: number]: {
    UserID: number;
    QuestionID: number;
    Vote: number;
  };
}

export interface voteValidateInterface {
  Vote: number;
}

export interface updateVoteInterface {
  [index: number]: [userId: number, questionId: number, voteValue: number];
}

export interface insertBookmarkInterface {
  [index: number]: [userId: number, questionId: number];
}

export interface fetchBookmarkInterface {
  [index: number]: {
    userId: number;
    questionId: number;
  };
}

export interface viewBookmarkedInterface {
  [index: number]: {
    QuestionID: number;
    Question: string;
  };
}

export interface userSignupInterface {
  [index: number]: [username: string, email: string, encryptedPassword: string];
}

