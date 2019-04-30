import React from "react";
import HandleAuthError from "./HandleAuthError";

describe("HandleAuthError", () => {
  it("should handle UserNotFoundException", () => {
    const err = {
      code: "UserNotFoundException"
    };
    expect(HandleAuthError(err)).toEqual("That user does not exist");
  });
  it("should handle UsernameExistsException", () => {
    const err = {
      code: "UsernameExistsException"
    };
    expect(HandleAuthError(err)).toEqual(
      "An account with the given email already exists"
    );
  });
  it("should handle PasswordTooShortException", () => {
    const err = {
      message:
        "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6"
    };
    expect(HandleAuthError(err)).toEqual(
      "Your password must have at least 6 characters"
    );
  });
});
