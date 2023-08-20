const useFirebaseErrorMessage = (error: any) => {
  const code = error?.code || "";
  const errorCodeParts = code.split("/");
  if (!errorCodeParts.length) return "";
  let message = errorCodeParts.reverse()[0].replaceAll("-", " ");
  return message;
};

export default useFirebaseErrorMessage;
