// https://markpollmann.com/testing-react-applications/#mocking-modules-with-jestmock
export const Auth = {
  currentSession: jest.fn(() => Promise.resolve()),
  signUp: jest.fn(({ username, password }) => {
    if (username === "alreadysignedup@example.com") {
      return Promise.reject({
        message: "An account with the given email already exists"
      });
    } else {
      return Promise.resolve({ data: "new user" });
    }
  }),
  signIn: jest.fn((email, password) => {
    if (email === "username@example.com" && password === "password") {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }),
  signOut: jest.fn(() => {
    if (global.signedIn) {
      return Promise.resolve({ data: "signed out" });
    } else {
      return Promise.reject({ error: "you were already signed out" });
    }
  }),
  currentAuthenticatedUser: jest.fn(() => {
    if (global.signedIn) {
      return Promise.resolve({
        attributes: { sub: "ABCD-1234", email: "tziegler@whitehouse.gov" }
      });
    } else {
      return Promise.reject("not authenticated");
    }
  }),
  confirmSignUp: jest.fn(() => Promise.resolve())
};

export const API = {
  graphql: jest.fn(graphqlOperation => {
    var payload;
    var functionCall = graphqlOperation.split(" ")[1].split("(")[0];
    switch (functionCall) {
      case "GetMyProfile":
        payload = global.hasProfile
          ? {
              data: {
                getMyProfile: {
                  displayName: "CJ Cregg",
                  email: "ccregg@whitehouse.gov"
                }
              }
            }
          : { data: { getMyProfile: null } };
        break;
      case "UpdateUser":
        global.hasProfile = true;
        payload = {
          data: {
            updateUser: {
              displayName: "Danny Concannon",
              email: "dconcannon@nytimes.com"
            }
          }
        };
    }
    return Promise.resolve(payload);
  })
};

const Amplify = {
  Auth,
  API,
  configure: jest.fn()
};

export const graphqlOperation = jest.fn(query => query);

export default Amplify;
