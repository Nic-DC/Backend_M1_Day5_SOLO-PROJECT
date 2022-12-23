import express from "express";
import uniqid from "uniqid";
import { checkReviewSchema, triggerBadRequest } from "./validator.js";
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const reviewsRouter = express.Router();
// const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json");

// 1. POST: http://localhost:3001/blogPosts/
reviewsRouter.post("/", checkReviewSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request BODY: ", req.body);

  try {
    const post = {
      ...req.body,
      // category: "ARTICLE CATEGORY",
      // title: "ARTICLE TITLE",
      // cover: "ARTICLE COVER (IMAGE LINK)",
      // readTime: {
      //   value: `${req.body.readTime.vlue}`,
      //   unit: `${req.body.readTime.unit}`,
      //},
      // author: {
      //   name: `${req.body.author.name}`,
      //     avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`,
      //   },
      // content: `${req.body.content}`,
      createdAt: new Date(),
      _id: uniqid(),
    };

    console.log("The post is: ", post);
    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const postsList = await getBlogPosts();
    postsList.push(post);

    // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
    await writeBlogPosts(postsList);

    res.status(201).send({ message: `Post: '${post.title}' has been created by`, id: post._id });
  } catch (error) {
    next(error);
  }
});

// 2. GET ALL Blog Posts: http://localhost:3001/blogPosts/
reviewsRouter.get("/", async (req, res, next) => {
  // const content = fs.readFileSync(postsJSONPath);
  // const postsList = JSON.parse(content);

  try {
    const postsList = await getBlogPosts();
    if (req.query && req.query.category) {
      const filteredPosts = postsList.filter(
        (post) => post.category.toLowerCase() === req.query.category.toLowerCase()
      );
      res.send(filteredPosts);
    } else {
      res.send(postsList);
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET SINGLE Blog Post: http://localhost:3001/authors/:blogPostId
reviewsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostId = req.params.blogPostId;

    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const postsList = await getBlogPosts();

    const post = postsList.find((post) => post._id === blogPostId);

    if (post) {
      res.send(post);
    } else {
      // next(createHttpError(404, `The post with id: ${blogPostId} is not in the archive`));
      next(NotFound(`The post with id: ${blogPostId} is not in the archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. UPDATE SINGLE Blog Post: http://localhost:3001/authors/:blogPostId
reviewsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const { blogPostId } = req.params;

    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const postsList = await getBlogPosts();
    const index = postsList.findIndex((post) => post._id === blogPostId);

    if (index !== -1) {
      const oldPost = postsList[index];
      const updatePost = { ...oldPost, ...req.body, updatedAt: new Date() };
      postsList[index] = updatePost;

      console.log("Updated post: ", updatePost);

      // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
      await writeBlogPosts(postsList);
      res.send(updatePost);
    } else {
      next(NotFound(`Book with id ${blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE SINGLE AUTHOR: http://localhost:3001/authors/:blogPostId
reviewsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const postsList = await getBlogPosts();

    const remainingPosts = postsList.filter((post) => post._id !== req.params.blogPostId);

    if (postsList.length !== remainingPosts.length) {
      // fs.writeFileSync(postsJSONPath, JSON.stringify(remainingPosts));
      writeBlogPosts(remainingPosts);
      res.send({ message: `Post deleted successfully` });
    } else {
      next(NotFound(`The post with the id: ${req.params.blogPostId} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
