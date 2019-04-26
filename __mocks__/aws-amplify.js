// https://markpollmann.com/testing-react-applications/#mocking-modules-with-jestmock
const Amplify = {
  Auth: {
    currentSession: jest.fn(() => Promise.resolve()),
    signIn: jest.fn(() => Promise.resolve()),
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
    })
  },
  API: {
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
            : { getMyProfile: { data: null } };
          break;
        case "UpdateUser":
          global.hasProfile = true;
          payload = {
            data: {
              updateUser: {
                displayName: "Danny Kincaid",
                email: "dkincaid@nytimes.com"
              }
            }
          };
      }
      return Promise.resolve(payload);
    })
  },
  graphqlOperation: jest.fn(query => query),
  configure: jest.fn()
};

export default Amplify;
