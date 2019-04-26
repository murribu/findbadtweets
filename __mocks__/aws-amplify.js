// https://markpollmann.com/testing-react-applications/#mocking-modules-with-jestmock
const Amplify = {
  Auth: {
    currentSession: jest.fn(() => Promise.resolve()),
    signIn: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    currentAuthenticatedUser: jest.fn(() => {
      if (global.loggedIn) {
        return Promise.resolve({ attributes: { sub: "ABCD-1234" } });
      } else {
        return Promise.reject("not authenticated");
      }
    })
  },
  API: {
    graphql: jest.fn(() =>
      Promise.resolve({ data: { displayName: "Pat Jones" } })
    )
  },
  graphqlOperation: jest.fn(() => Promise.resolve()),
  configure: jest.fn()
};

export default Amplify;
