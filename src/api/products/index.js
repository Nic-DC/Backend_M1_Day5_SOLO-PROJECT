import express from "express";
import uniqid from "uniqid";
import { checkProductSchema, triggerBadRequest } from "./validator.js";
import { getBlogPosts, getProducts, writeBlogPosts, writeProducts } from "../../lib/fs-tools.js";

import httpErrors from "http-errors";
const { NotFound, BadRequest } = httpErrors;

const productsRouter = express.Router();
// const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json");

// 1. POST: http://localhost:3005/products/
productsRouter.post("/", checkProductSchema, triggerBadRequest, async (req, res, next) => {
  console.log("Request BODY: ", req.body);

  try {
    const product = {
      ...req.body,
      _id: uniqid(),
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
    };

    console.log("The product is: ", product);
    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const productsList = await getProducts();
    productsList.push(product);

    // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
    await writeProducts(productsList);

    res.status(201).send({ message: `Product: '${product.name}' has been created by`, id: product._id });
  } catch (error) {
    next(error);
  }
});

// 2. GET ALL Blog Posts: http://localhost:3005/products/
productsRouter.get("/", async (req, res, next) => {
  // const content = fs.readFileSync(postsJSONPath);
  // const postsList = JSON.parse(content);

  try {
    const productsList = await getProducts();
    if (req.query && req.query.category) {
      const filteredProducts = productsList.filter(
        (product) => product.category.toLowerCase() === req.query.category.toLowerCase()
      );
      res.send(filteredProducts);
    } else {
      res.send(productsList);
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET SINGLE Blog Post: http://localhost:3005/products/:productId
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const productsList = await getProducts();

    const product = productsList.find((product) => product._id === productId);

    if (post) {
      res.send(product);
    } else {
      // next(createHttpError(404, `The post with id: ${blogPostId} is not in the archive`));
      next(NotFound(`The product with id: ${productId} is not in the archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. UPDATE SINGLE Blog Post: http://localhost:3005/products/:productId
productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;

    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const productsList = await getBlogPosts();
    const index = productsList.findIndex((product) => product._id === productId);

    if (index !== -1) {
      const oldProduct = productsList[index];
      const updatedProduct = { ...oldProduct, ...req.body, updatedAt: new Date() };
      productsList[index] = updatedProduct;

      console.log("Updated post: ", updatedProduct);

      // fs.writeFileSync(postsJSONPath, JSON.stringify(postsList));
      await writeProducts(productsList);
      res.send(updatedProduct);
    } else {
      next(NotFound(`Product with id ${productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE SINGLE AUTHOR: http://localhost:3005/products/:productId
productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    // const postsList = JSON.parse(fs.readFileSync(postsJSONPath));
    const postsList = await getBlogPosts();

    const remainingPosts = postsList.filter((post) => post._id !== req.params.productId);

    if (postsList.length !== remainingPosts.length) {
      // fs.writeFileSync(postsJSONPath, JSON.stringify(remainingPosts));
      writeBlogPosts(remainingPosts);
      res.send({ message: `Post deleted successfully` });
    } else {
      next(NotFound(`The post with the id: ${req.params.productId} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
