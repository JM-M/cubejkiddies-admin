const useFirebaseErrorMessage = (errorCode: string) => {
  let message = "";
  if (errorCode === "auth/wrong-password")
    message = "Invalid email or password";
  return message;
};

export default useFirebaseErrorMessage;
