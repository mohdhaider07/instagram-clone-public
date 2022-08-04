import mongoose from "mongoose";
import cors from "cors";
import User from "./models/user.js";
import express from "express";
import { hashPassword, comparePassword } from "./helpers/auth.js";
import jwt from "jsonwebtoken";
import {
	requireSignin,
	canEditOrDelete,
	addFollower,
	userFollow,
	removeFollower,
	userUnFollow,
	isAdmin,
} from "./middlewares/index.js";
import Post from "./models/post.js";
import cloudinary from "cloudinary";
import { nanoid } from "nanoid";
//Formidable is a Node.js module for parsing form data, including multipart/form-data file upload.
import formidable from "express-formidable";

import morgan from "morgan";

// SEE the dotenv FILE FOR DATABASE CONNECTION

import dotenv from "dotenv";
dotenv.config();

const app = express();

// import https from "http";
// const http = https.createServer(app);

// import socket from "socket.io";

import { Server } from "socket.io";
import { createServer } from "http";
const http = createServer(app);
const io = new Server(http, {
	path: "/socket.io",
	cors: {
		origin: [process.env.CLIENT_URL],
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-type"],
	},
});

// const io = socket(http, {
// 	path: "/socket.io",
// 	cors: {
// 		origin: process.env.CLIENT_URL,
// 		methods: ["GET", "POST"],
// 		allowedHeaders: ["Content-type"],
// 	},
// });

mongoose
	.connect(process.env.DATABASE)
	.then(() => console.log(" DB connected"))
	.catch((err) => console.log("err in db", err));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: [process.env.CLIENT_URL],
	})
);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

// register page api
app.post("/api/register", async (req, res) => {
	// console.log("register form Data ",req.body);
	const { name, email, password, secret } = req.body;
	// validation of user
	if (!name || !password || !secret || !email) {
		return res.json({ error: "fill form correctly" });
	}
	const exist = await User.findOne({ email });
	if (exist) {
		return res.json({ error: "This email is taken" });
	}
	// hashing password
	const hashedPassword = await hashPassword(password);
	const user = new User({
		name,
		email,
		password: hashedPassword,
		secret,
		username: nanoid(6),
	});
	try {
		// console.log("User=>",user);
		await user.save(); // saving user in database
		return res.json({
			ok: true,
		});
	} catch (err) {
		console.log("Registration Failed=>", err);
		return res.status(400).send("Error try again"); // for errors
	}
});

//login page api
app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	// console.log(email, password);
	try {
		// validation of email
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ error: "user does not exist" });
		}
		//validation of password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.json({ error: "email or password incorrect" });
		}
		// creating token
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		user.password = undefined;
		user.secret = undefined;
		res.json({
			token,
			user,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).send("Error please try again.");
	}
});

// dash bord page
app.get("/api/current-user", requireSignin, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

// For password Change
app.post("/api/forgot-password", async (req, res) => {
	const { email, newPassword, secret } = req.body;
	//  console.log(" backend => ",req.body);
	if (!newPassword) {
		return res.json({
			error: "New password is Require!",
		});
	}
	if (!secret) {
		return res.json({
			error: "Secret is Require!",
		});
	}

	const user = await User.findOne({ email, secret });
	if (!user) {
		return res.json({
			error: "We can't verify you with those details",
		});
	}

	try {
		const hashed = await hashPassword(newPassword);
		await User.findByIdAndUpdate(user._id, { password: hashed });
		return res.json({
			success: "Congrats,  Now you Can login with your new password",
		});
	} catch (err) {
		console.log(err);
		return res.json({
			err: "We can't verify you with those details",
		});
	}
});

//*******************************  creating post   *******************

app.post("/api/create-post", requireSignin, async (req, res) => {
	// console.log("content=>",req.body);
	const { content, image } = req.body;
	if (!content.length) {
		return res.json({
			error: "Content is required",
		});
	}

	try {
		const post = new Post({ content, image, postedBy: req.user._id });
		await post.save();
		const postWithUser = await Post.findById(post._id).populate(
			"postedBy",
			"-password -secret"
		);
		res.json(postWithUser);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

// posting Image
app.post(
	"/api/upload-image",
	requireSignin,
	formidable({ maxFileSize: 5 * 1024 * 1024 }),
	async (req, res) => {
		//  console.log("image data=>",req.files);
		try {
			const result = await cloudinary.uploader.upload(req.files.image.path);
			// console.log("result after uploading image=>",result);
			res.json({
				url: result.secure_url,
				public_id: result.public_id,
			});
		} catch (err) {
			console.log(err);
		}
	}
);

// getting from users post
app.get("/api/user-posts", requireSignin, async (req, res) => {
	try {
		// const posts =await Post.find({postedBy:req.user._id})
		const posts = await Post.find()
			.populate("postedBy", "_id name image")
			.sort({ createdAt: -1 })
			.limit(10);
		res.json(posts);
	} catch (err) {
		console.log(err);
	}
});

// for geting sigle  post

app.get("/api/user-post/:_id", requireSignin, async (req, res) => {
	try {
		const post = await Post.findById(req.params._id);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

// updating the post ******************

app.put(
	"/api/update-post/:_id",
	requireSignin,
	canEditOrDelete,
	async (req, res) => {
		const { content, image } = req.body;
		if (!content.length) {
			return res.json({
				error: "Content is required",
			});
		}

		try {
			const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
				new: true,
			});
			res.json(post);
		} catch (err) {
			console.log(err);
		}
	}
);

// fro deleting the post

app.delete(
	"/api/delete-post/:_id",
	requireSignin,
	canEditOrDelete,
	async (req, res) => {
		try {
			const post = await Post.findByIdAndDelete(req.params._id);

			// removing image from cloudinary
			if (post.image && post.image.public_id) {
				const image = await cloudinary.uploader.destroy(
					post.image.public_id
				);
			}

			res.json({ ok: true });
		} catch (err) {
			console.log(err);
		}
	}
);

// **********updating profile********

app.put("/api/profile-update", requireSignin, async (req, res) => {
	try {
		// console.log("profile update",req.body);
		const data = {};
		if (req.body.username) {
			data.username = req.body.username;
		}
		if (req.body.about) {
			data.about = req.body.about;
		}
		if (req.body.name) {
			data.name = req.body.name;
		}
		if (req.body.password) {
			if (req.body.password.length < 6) {
				return res.json({
					error: " Password Must Be 6 characters long",
				});
			} else {
				data.password = await hashPassword(req.user.password);
			}
		}
		if (req.body.secret) {
			data.secret = req.body.secret;
		}
		if (req.body.image) {
			data.image = req.body.image;
		}

		let user = await User.findByIdAndUpdate(req.user._id, data, {
			new: true,
		});

		user.password = undefined;
		user.secret = undefined;

		res.json(user);
	} catch (err) {
		if (err.code == 11000) {
			return res.json({
				error: "This Username is Already taken",
			});
		}
		console.log(err);
	}
});

// finding people to follow
app.get("/api/find-people", requireSignin, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		let following = user.following;
		following.push(user._id);
		const people = await User.find({ _id: { $nin: following } })
			.select("-password -secret")
			.limit(10);
		res.json(people);
	} catch (err) {
		console.log(err);
	}
});

// ******************Follow people*************

app.put("/api/user-follow", requireSignin, addFollower, userFollow);

//**************NEWS FEED */
app.get("/api/news-feed/:page", requireSignin, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		let following = user.following;
		following.push(req.user._id);
		//pagination
		const currentPage = req.params.page || 1;
		const perPage = 6;
		const posts = await Post.find({ postedBy: { $in: following } })
			.skip((currentPage - 1) * perPage)
			.populate("postedBy", "_id name image")
			.populate("comments.postedBy", "_id name image")
			.sort({ createdAt: -1 })
			.limit(perPage);
		//    console.log(posts);
		res.json(posts);
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/single-post/:_id", async (req, res) => {
	const _id = req.params._id;
	console.log("ID=>", _id);
	try {
		const post = await Post.findById(_id)
			.populate("postedBy", "_id name image")
			.populate("comments.postedBy", "_id name image");

		console.log("potsts", post);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

app.post("/api/noOfPosts", requireSignin, async (req, res) => {
	try {
		console.log("user id no of posts => ", req.body._id);
		const user = await User.findById(req.body._id);
		let following = user.following;
		following.push(req.body._id);
		const posts = await Post.find({ postedBy: { $in: following } }).count();

		//    console.log(posts);
		res.json(posts);
	} catch (err) {
		console.log(err);
	}
});

// finding following people
app.post("/api/following-people", requireSignin, async (req, res) => {
	// console.log(req.body._id);
	try {
		const user = await User.findById(req.body._id);
		let following = user.following;

		const people = await User.find({ _id: { $in: following } })
			.select("-password -secret")
			.limit(10);
		res.json(people);
	} catch (err) {
		console.log(err);
	}
});

//   handling unfollow
app.put("/api/user-unfollow", requireSignin, removeFollower, userUnFollow);

// finding folowers people
app.post("/api/follower-people", requireSignin, async (req, res) => {
	// console.log(req.body._id);
	try {
		const user = await User.findById(req.body._id);
		let followers = user.followers;

		const people = await User.find({ _id: { $in: followers } }).select(
			"-password -secret"
		);

		res.json(people);
	} catch (err) {
		console.log(err);
	}
});

// likes unlike
app.put("/api/like-post", requireSignin, async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(
			req.body._id,
			{
				$addToSet: { likes: req.user._id },
			},
			{ new: true }
		);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

app.put("/api/unlike-post", requireSignin, async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(
			req.body._id,
			{
				$pull: { likes: req.user._id },
			},
			{ new: true }
		);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

// Add comment
app.put("/api/add-comment", requireSignin, async (req, res) => {
	try {
		const { postId, comment } = req.body;
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { text: comment, postedBy: req.user._id } },
			},
			{ new: true }
		)
			.populate("postedBy", "_id name image")
			.populate("comments.postedBy", "_id name image");
		// console.log(post);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

// remove comment
app.put("/api/remove-comment", requireSignin, async (req, res) => {
	try {
		const { postId, comment } = req.body;
		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { comments: { _id: comment._id } },
			},
			{ new: true }
		)
			.populate("postedBy", "_id name image")
			.populate("comments.postedBy", "_id name image");
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/total-post", async (req, res) => {
	try {
		const total = await Post.find().estimatedDocumentCount();
		res.json(total);
	} catch (err) {
		console.log(err);
	}
});
//searching user
app.get("/api/search-user/:query", async (req, res) => {
	const { query } = req.params;
	try {
		//$regex speacial method form mongodb
		// i use for case sensitive matching
		const user = await User.find({
			$or: [
				{ name: { $regex: query, $options: "i" } },
				{ username: { $regex: query, $options: "i" } },
			],
		}).select("-password -secret");
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});

//user profile
app.get("/api/user/:_id", async (req, res) => {
	const { _id } = req.params;
	try {
		const user = await User.findById(_id).select("-password -secret");
		res.json(user);
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/singleuser-posts/:_id", async (req, res) => {
	const { _id } = req.params;
	try {
		const post = await Post.find({ postedBy: _id });
		// console.log(post);
		res.json(post);
	} catch (err) {
		console.log(err);
	}
});

// geting all the post
app.get("/api/posts", async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("postedBy", "_id name image")
			.populate("comments.postedBy", "_id name image")
			.sort({ createdAt: -1 })
			.limit(12);
		res.json(posts);
	} catch (err) {
		console.log(err);
	}
});

app.delete(
	"/api/admin/delete-post/:_id",
	requireSignin,
	isAdmin,
	async (req, res) => {
		try {
			const post = await Post.findByIdAndDelete(req.params._id);

			// removing image from cloudinary
			if (post.image && post.image.public_id) {
				const image = await cloudinary.uploader.destroy(
					post.image.public_id
				);
			}

			res.json({ ok: true });
		} catch (err) {
			console.log(err);
		}
	}
);

app.get("/api/current-admin", requireSignin, isAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.json({ ok: true });
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

app.post("/api/save-post", requireSignin, async (req, res) => {
	console.log(req.body, req.user._id);
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { savedPost: req.body._id },
			},
			{ new: true }
		).select("-password -secret");
		res.send(user);
	} catch {
		console.log(err);
	}
});
app.post("/api/unsave-post", requireSignin, async (req, res) => {
	console.log(" unsave =>", req.body, req.user._id);
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { savedPost: req.body._id },
			},
			{ new: true }
		).select("-password -secret");
		res.send(user);
	} catch {
		console.log(err);
	}
});

app.post("/api/fetch-saved-post", requireSignin, async (req, res) => {
	try {
		const user = await User.findById(req.body._id);
		let posts = user.savedPost;

		const savedPost = await Post.find({ _id: { $in: posts } }).select(
			"image"
		);

		res.json(savedPost);
	} catch (err) {
		console.log(err);
	}
});

io.on("connect", (socket) => {
	socket.on("new-post", (newPost) => {
		socket.broadcast.emit("receive-post", newPost);
	});
});

app.get("/", (req, res) => {
	res.send("appp is running");
});

http.listen(process.env.PORT || 8000, () => {
	console.log(`server is on 8000 or  running ${process.env.PORT}`);
});
