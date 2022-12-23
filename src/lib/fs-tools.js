import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

// the path to the data folder that contains the .json files
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
console.log("The dataFolderPath is: ", dataFolderPath);

// paths to the public/img/ folders that hold the images for authors and blogPosts
const publicFolderPathProducts = join(process.cwd(), "./public/img/products");
const publicFolderPathReviews = join(process.cwd(), "./public/img/reviews");

// the path to authorsList.json file
const productsJSONPath = join(dataFolderPath, "products.json");
// the path to blogPosts.json file
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

// the function to return the content of authorsList - as a Promise
export const getProducts = () => readJSON(productsJSONPath);
// the function to return the content of authorsList after actions have been performed on it - as a Promise
export const writeProducts = (productsList) => writeJSON(productsJSONPath, productsList);

// the function to return the content of blogPosts as a Promise
export const getReviews = () => readJSON(reviewsJSONPath);
// the function to return the content of blogPosts after actions have been performed on it - as a Promise
export const writeReviews = (reviewsList) => writeJSON(reviewsJSONPath, reviewsList);

export const saveProductsImages = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPathProducts, fileName), contentAsBuffer);
export const saveReviewsImages = (fileName, contentAsBuffer) =>
  writeFile(join(publicFolderPathReviews, fileName), contentAsBuffer);
