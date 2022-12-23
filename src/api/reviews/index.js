import express from "express";
import uniqid from "uniqid";
import { checkReviewSchema, triggerBadRequest } from "./validator.js";
import { getReviews, writeReviews, getProducts } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const reviewsRouter = express.Router();
// const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json");

// 1. POST: http://localhost:3005/products/:productId/reviews/
reviewsRouter.post("/:productId/reviews", checkReviewSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request BODY: ", req.body);
  console.log("Request params: ", req.params);

  try {
    const productId = req.params.productId;
    const productsList = await getProducts();
    const product = productsList.find((product) => product._id === productId);
    console.log("productId: ", productId);

    if (product) {
      const review = {
        _id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        productId: productId,
      };
      console.log("The review is: ", review);
      // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
      const reviewsList = await getReviews();
      reviewsList.push(review);

      // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
      await writeReviews(reviewsList);

      res
        .status(201)
        .send({ message: `Review for product with id: '${review.productId}' has been created by`, id: review._id });
    } else {
      // next(createHttpError(404, `The post with id: ${productId} is not in the archive`));
      next(NotFound(`The product with id: ${productId} is not in the archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 2. GET ALL Blog Posts: http://localhost:3005/reviews/
reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  // const content = fs.readFileSync(postsJSONPath);
  // const postsList = JSON.parse(content);

  try {
    const productId = req.params.productId;
    const productsList = await getProducts();
    const product = productsList.find((product) => product._id === productId);
    console.log("productId: ", productId);

    if (product) {
      const reviewsList = await getReviews();
      res.send(reviewsList);
      // if (req.query && req.query.productId) {
      //   const filteredReviews = reviewsList.filter((review) => review.productId === req.query.productId);
      //   res.send(filteredReviews); }
    } else {
      // res.send(reviewsList);
      next(NotFound(`The product with id: ${productId} is not in the archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET SINGLE Blog Post: http://localhost:3005/reviews/:productId
reviewsRouter.get("/:productId/reviews/:id", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsList = await getProducts();
    const product = productsList.find((product) => product._id === productId);
    console.log("productId: ", productId);

    if (product) {
      const reviewId = req.params.id;

      // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
      const reviewsList = await getReviews();

      const review = reviewsList.find((review) => review._id === reviewId);

      if (review) {
        res.send(review);
      } else {
        // next(createHttpError(404, `The post with id: ${productId} is not in the archive`));
        next(NotFound(`The post with id: ${reviewId} is not in the archive`));
      }
    } else {
      next(NotFound(`The post with id: ${reviewId} is not in the archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. UPDATE SINGLE Blog Post: http://localhost:3001/:productId/reviews/:id
reviewsRouter.put("/:productId/reviews/:id", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productsList = await getProducts();
    const product = productsList.find((product) => product._id === productId);
    console.log("productId: ", productId);

    if (product) {
      const { id } = req.params;
      console.log("review id is: ", id);

      // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
      const reviewsList = await getReviews();
      const index = reviewsList.findIndex((review) => review._id === id);

      if (index !== -1) {
        const oldReview = reviewsList[index];
        const updatedReview = { ...oldReview, ...req.body, updatedAt: new Date() };
        reviewsList[index] = updatedReview;

        console.log("Updated post: ", updatedReview);

        // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
        await writeReviews(reviewsList);
        res.send(updatedReview);
      } else {
        next(NotFound(`Review with id ${reviewId} not found!`));
      }
    } else {
      next(NotFound(`Product with id ${productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE SINGLE AUTHOR: http://localhost:3001/authors/:productId
reviewsRouter.delete("/:productId/reviews/:id", async (req, res, next) => {
  try {
    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const reviewsList = await getReviews();

    const remainingReviews = reviewsList.filter((review) => review._id !== req.params.productId);

    if (postsList.length !== remainingReviews.length) {
      // fs.writeFileSync(postsJSONPath, JSON.stringify(remainingPosts));
      writeReviews(remainingReviews);
      res.send({ message: `Review deleted successfully` });
    } else {
      next(NotFound(`The post with the id: ${req.params.productId} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
