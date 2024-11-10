import express from 'express';
import Post from "../models/Post.js";
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();


//get all posts
router.get('/',authMiddleware, async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server error', error: err.message });
    }
  });
  

//create post
router.post("/api/posts", authMiddleware, async (req, res) => {
    const { amount, currency, provider, swiftCode, ibanPayee } = req.body;
  
    //validate request body
    if (!amount || !currency || !provider || !swiftCode || !ibanPayee) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
  
    //Create a new post
    const newPost = new Post({ amount, currency, provider, swiftCode, ibanPayee });
  
    try {
      const savedPost = await newPost.save();
      res.status(201).json({ message: "Post uploaded", savedPost });
    } catch (err) {
      console.error("Error saving post", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });


//get post by id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      console.error("Error getting post", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });



//update post by id
router.put("/:id", authMiddleware, async (req, res) => {
    const { amount, currency, provider, swiftCode, ibanPayee } = req.body;
  
    //validate request body
    if (!amount && !currency && !provider && !swiftCode && !ibanPayee) {
      return res
        .status(400)
        .json({ message: "Nothing to update please fill in one of the fields" });
    }
  
    const updateFields = {};
    if (amount) updateFields.amount = amount;
    if (currency) updateFields.currency = currency;
    if (provider) updateFields.provider = provider;
    if (swiftCode) updateFields.swiftCode = swiftCode;
    if (ibanPayee) updateFields.ibanPayee = ibanPayee;
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json({ message: "Post updated", updatedPost });
    } catch (err) {
      console.error("Error updating post", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });




  //delete post by id

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (err) {
      console.error("Error deleting post", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });




export default router;
