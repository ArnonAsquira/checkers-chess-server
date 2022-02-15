function validateErr(err: any): { text: string } {
  if (err.response && typeof err.response.data === "string") {
    return { text: err.response.data };
  }
  return { text: "soemthing went wrong" };
}

export default validateErr;
