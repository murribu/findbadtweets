export const getMyProfile = `query GetMyProfile {
  getMyProfile {
    displayName
    email
  }
}`;

export const getUser = `query GetUser($user_id:String) {
  getUser(user_id: $user_id) {
    displayName
  }
}`;
