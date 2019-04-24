export const updateUser = `
mutation UpdateUser($displayName:String, $email:String) {
  updateUser(displayName: $displayName, email: $email) {
    displayName
    email
  }
}`;
