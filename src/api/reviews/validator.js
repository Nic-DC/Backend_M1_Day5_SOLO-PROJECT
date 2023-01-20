import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is a mandatory field and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isDecimal: {
      errorMessage: "Price is a mandatory field and needs to be a number",
    },
  },
  // rate: {
  //   in: ["body"],
  //   isDecimal: {
  //     errorMessage: "Rate is a mandatory field and needs to be between 1 and 5",
  //     force_decimal: true,
  //   },
  // },
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "productId is a mandatory field and needs to be a string!",
    },
  },
};

export const checkReviewSchema = checkSchema(reviewSchema);

export const triggerBadRequest = (req, res, next) => {
  const errorList = validationResult(req);

  if (!errorList.isEmpty()) {
    next(createHttpError(400, "Error during post validation", { errors: errorList.array() }));
    // next(createHttpError(400, "Error during post validation"));
  } else {
    next();
  }
};
