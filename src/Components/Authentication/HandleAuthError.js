// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html#API_InitiateAuth_Errors
const HandleAuthError = err => {
  switch (err.code) {
    case "UserNotFoundException":
      return "That user does not exist";
    case "UsernameExistsException":
      return "An account with the given email already exists";
    default:
      switch (err.message) {
        case "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6":
          return "Your password must have at least 6 characters";
        default:
          return err.message;
      }
  }
};

export default HandleAuthError;
