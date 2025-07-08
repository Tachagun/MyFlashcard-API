export const validate = (schema) => async (req, res, next) => {

  try {
    await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (error) {
    const errorMsg = error.errors.map((item) => item);
    const errorTxt = errorMsg.join(",");
    console.log(errorTxt);
    const mergedError = new Error(errorTxt);
    next(mergedError);
  }
};
