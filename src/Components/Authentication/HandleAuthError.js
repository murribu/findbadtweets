// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Errors
const HandleAuthError = err => {
  switch (err.code) {
    case "UserNotFoundException":
      return "That user does not exist";
      break;
    default:
      return err.message;
  }
};

export default HandleAuthError;
