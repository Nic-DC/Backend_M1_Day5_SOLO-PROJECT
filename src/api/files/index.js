import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveProductsImages,
  saveReviewsImages,
  getProducts,
  writeProducts,
  getReviews,
  writeReviews,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post("/product/:id", multer().single("image"), async (req, res, next) => {
  try {
    const originalFileExtension = extname(req.file.originalname);
    const fileName = req.params.id + originalFileExtension;

    await saveProductsImages(fileName, req.file.buffer);

    const url = `http://localhost:3005/img/products/${fileName}`;

    const productsList = await getProducts();

    const index = productsList.findIndex((product) => product._id === req.params.id);

    if (index !== -1) {
      const oldProduct = productsList[index];

      const imageUrl = url;
      const updatedProduct = { ...oldProduct, imageUrl, updatedAt: new Date() };

      productsList[index] = updatedProduct;

      await writeProducts(productsList);
    }
    res.send("Product image is uploaded");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default filesRouter;
