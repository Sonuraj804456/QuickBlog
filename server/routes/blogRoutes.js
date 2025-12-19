import express from 'express';
import addBlog from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';
import { getAllBlogs,deleteBlogById,getBlogById,togglePublish,addComment,getBlogComments,generateContent } from '../controllers/blogController.js';

const blogRouter =express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/comment", getBlogComments);
blogRouter.post("/generate-content", generateContent);



export default blogRouter;