import Post from "../models/post.js";
import expressJwt from "express-jwt";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"],
});

export const canEditOrDelete = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params._id);
		// console.log("can edit or delete ",post.postedBy);
		// console.log(post.postedBy,"  ",req.user._id)
		if (post.postedBy != req.user._id) {
			return res.status(400).send("Unauthorized user");
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
	}
};
// is Admin
export const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);
		// console.log("can edit or delete ",post.postedBy);
		// console.log(post.postedBy,"  ",req.user._id)
		if (user.role !== "Admin") {
			console.log("errs you are not admin");
			return res.status(400).send("Unauthorized Admin");
		} else {
			// console.log("you are admin")
			next();
		}
	} catch (err) {
		console.log(err);
	}
};
// addFollower,userFollow
export const addFollower = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.body._id, {
			$addToSet: { followers: req.user._id },
		});
		next();
	} catch (err) {
		console.log(err);
	}
};

export const userFollow = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$addToSet: { following: req.body._id },
			},
			{ new: true }
		).select("-password -secret");
		res.json(user);
	} catch (err) {
		console.log(err);
	}
};

//removeFollower, userUnFollow

export const removeFollower = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.body._id, {
			$pull: { followers: req.user._id },
		});
		next();
	} catch (err) {
		console.log(err);
	}
};

export const userUnFollow = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { following: req.body._id },
			},
			{ new: true }
		).select("-password -secret");
		res.json(user);
	} catch (err) {
		console.log(err);
	}
};
