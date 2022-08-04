import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { TbMessageCircle2 } from "react-icons/tb";
import { MdOutlineSave, MdSave } from "react-icons/md";
import { HeartOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
const SinglePost = ({ setShowPost, showPost, setState, state, _id }) => {
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		_id && showPost && getPost();
	}, [_id]);

	const getPost = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/single-post/${_id}`
			);
			setPost(data);
			setLoading(false);
			console.log(data);
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	const handleUnlike = async (_id) => {
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/unlike-post",
				{ _id }
			);
			const newpost = post;
			newpost.likes = data.likes;
			console.log(newpost);
			setPost(newpost);
			// console.log("unliked",data);
		} catch (err) {
			console.log(err);
		}
	};
	const handleLike = async (_id) => {
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/like-post",
				{ _id }
			);
			// setPosts([]);
			// setPage(1);
			const newpost = post;
			newpost.likes = data.likes;
			console.log(newpost);
			setPost(newpost);
			// console.log(data);

			// console.log("liked",data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleSave = async (_id) => {
		console.log(_id);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/save-post",
				{ _id }
			);
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// console.log(data);
		} catch (err) {
			console.log(err);
		}
	};
	const handleUnSave = async (_id) => {
		console.log(_id);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/unsave-post",
				{ _id }
			);
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// console.log("bancked data=", data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleComment = () => {};

	console.log("post=>", post);

	return (
		<Modal
			visible={showPost}
			onCancel={() => setShowPost(false)}
			footer={null}
			title={
				post && (
					<Link href={`/user/${post.postedBy._id}`}>
						<div
							onClick={() => setShowPost(false)}
							className="flex space-x-2 items-start "
						>
							{post &&
							post.postedBy &&
							post.postedBy.image &&
							post.postedBy.image.url ? (
								<img
									className="h-10 cursor-pointer w-10 object-cover rounded-full"
									src={post.postedBy.image.url}
									alt="user"
								></img>
							) : (
								<UserOutlined className="text-xl cursor-pointer " />
							)}

							<span className="mt-1 cursor-pointer">
								{post && post.postedBy && post.postedBy.name}
							</span>
						</div>
					</Link>
				)
			}
		>
			{post && !loading ? (
				<div className=" ">
					<div className="h-[20rem] flex justify-center">
						{post && post.image && (
							<img
								className="object-contain h-full"
								src={post.image.url}
							/>
						)}
					</div>
				</div>
			) : (
				<div>Loading...</div>
			)}
		</Modal>
	);
};

export default SinglePost;
