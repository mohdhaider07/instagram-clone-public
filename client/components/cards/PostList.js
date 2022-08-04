import { useContext } from "react";
import { Avatar } from "antd";
import renderHTML from "react-render-html";
import moment from "moment";
import { FiSend } from "react-icons/fi";
import { TbMessageCircle2 } from "react-icons/tb";
import { MdOutlineSave, MdSave } from "react-icons/md";
import {
	HeartOutlined,
	HeartFilled,
	CommentOutlined,
	EditOutlined,
	DeleteOutlined,
	LoadingOutlined,
	UserOutlined,
	MessageOutlined,
	SaveOutlined,
	ShareAltOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import UserRoute from "../routes/UserRoute";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

import dynamic from "next/dynamic";
const InputEmoji = dynamic(() => import("react-input-emoji"), { ssr: false });

const PostList = ({
	posts,
	handleDelete,
	deleteLoading,
	setPosts,
	setPage,
	handleComment,
	comment,
	setComment,
	addComment,
	setCurrentPost,
}) => {
	const [state, setState] = useContext(UserContext);
	const router = useRouter();

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

	//Like

	const handleLike = async (_id) => {
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/like-post",
				{ _id }
			);
			// setPosts([]);
			// setPage(1);
			const newPosts = posts.map((p) => {
				if (p._id === _id) {
					let newPost = p;
					newPost.likes = data.likes;
					return newPost;
				} else {
					return p;
				}
			});
			setPosts(newPosts);
			// console.log(data);

			// console.log("liked",data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnlike = async (_id) => {
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/unlike-post",
				{ _id }
			);
			const newPosts = posts.map((p) => {
				if (p._id === _id) {
					let newPost = p;
					newPost.likes = data.likes;
					return newPost;
				} else {
					return p;
				}
			});
			setPosts(newPosts);
			// console.log("unliked",data);
		} catch (err) {
			console.log(err);
		}
	};

	// console.log("post list=>", posts);
	return (
		<>
			{posts &&
				posts.map((post) => (
					<div key={post._id} className="w-96 mb-6 ">
						<div className="p-3 flex bg-white border-b justify-between border-t rounded-t-lg border-l border-r items-center">
							<div className=" cursor-pointer flex items-center">
								<Link href={`/user/${post.postedBy._id}`}>
									{post &&
									post.postedBy &&
									post.postedBy.image &&
									post.postedBy.image.url ? (
										<Avatar
											className="mr-2"
											src={post.postedBy.image.url}
										/>
									) : (
										<Avatar
											className="mr-2"
											icon={<UserOutlined />}
										/>
									)}
								</Link>
								<Link href={`/user/${post.postedBy._id}`}>
									<p className="text-gray-900  leading-none">
										{post.postedBy.name}
									</p>
								</Link>
							</div>
							<div className="text-xl text-gray-400 font-extrabold">
								...
							</div>
						</div>
						<div className="relative  max-h-[24rem] h-fit  flex justify-center bg-white flex-none bg-cover rounded-t text-center ">
							{state &&
								state.user &&
								state.user._id === post.postedBy._id && (
									<div className="bg-white flex flex-col m-1 p-1 absolute right-0 rounded">
										<EditOutlined
											onClick={() =>
												router.push(`/user/post/${post._id}`)
											}
											className="  text-red-500 p-1"
										/>
										{deleteLoading ? (
											<LoadingOutlined className="  text-red-500  p-1 " />
										) : (
											<DeleteOutlined
												onClick={() => handleDelete(post._id)}
												className="  text-red-500  p-1"
											/>
										)}
									</div>
								)}

							{post.image && post.image.url ? (
								<img
									src={post.image.url}
									className="   object-contain "
									alt="Image"
								/>
							) : (
								<img
									className="object-contain "
									src="../images/parrot.jpg"
									alt="parrot"
								/>
							)}
						</div>
						<div className="border   bg-white rounded-b px-2 flex flex-col justify-between leading-normal">
							<div className="flex items-center justify-between">
								<div className="flex space-x-3 items-center ">
									{state &&
									state.user &&
									post &&
									post.likes &&
									post.likes.includes(state.user._id) ? (
										<div className="flex items-center">
											<HeartFilled
												onClick={() => handleUnlike(post._id)}
												style={{ cursor: "pointer" }}
												className="text-2xl text-rose-500"
											/>
											{/* {post.likes.length} Likes */}
										</div>
									) : (
										<div className="flex items-center">
											<HeartOutlined
												onClick={() => handleLike(post._id)}
												style={{ cursor: "pointer" }}
												className="text-[22px] mt-2"
											/>
											{/* {post.likes.length} Likes */}
										</div>
									)}
									<div
										onClick={() => handleComment(post)}
										style={{ cursor: "pointer" }}
										className="flex items-center "
									>
										{" "}
										<TbMessageCircle2 className="-mb-1  -ml-1 text-2xl " />
										{/* {post.comments.length} Comments */}
									</div>
									<div className="flex  items-center justify-center">
										<FiSend className=" cursor-pointer text-xl -mb-2  -ml-1" />
									</div>
								</div>

								{state &&
								state.user &&
								state.user.savedPost &&
								state.user.savedPost.includes(post._id) ? (
									<div
										className="cursor-pointer"
										onClick={() => handleUnSave(post._id)}
									>
										<MdSave className=" cursor-pointer  text-2xl " />
									</div>
								) : (
									<div onClick={() => handleSave(post._id)}>
										<MdOutlineSave className=" cursor-pointer  text-2xl " />
									</div>
								)}
							</div>
							<div className="mt-2 space-y-1">
								<span className="text-xs">
									{post.likes.length} Likes
								</span>
								<br />
								{state && state.user && post && (
									<>
										<span className=" text-xs  ">
											<span className=" font-semibold">
												{" "}
												{post.postedBy.name}
											</span>{" "}
											{post.content}
										</span>
										<br />
										{post.comments.length > 0 && (
											<span
												onClick={() => handleComment(post)}
												className="text-xs cursor-pointer text-gray-400 "
											>
												View all {post.comments.length} comments
											</span>
										)}
									</>
								)}
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<div className="text-xs mt-1">
										<p className="mb-1 text-gray-400">
											{moment(post.createdAt).fromNow()}
										</p>
									</div>
								</div>
							</div>
						</div>
						{post && post.comments && (
							<div className="  bg-white rounded-b-lg border">
								<ul className=" divide-gray-100">
									{post &&
										post.comments &&
										post.comments.length > 0 &&
										post.comments.slice(-2).map((c) => (
											<li key={c.created} className="p-1">
												<div className="flex items-center justify-between">
													<div>
														<Link
															href={`/user/${c.postedBy._id}`}
														>
															<span className="text-xs cursor-pointer -mb-2 flex">
																<span className="mr-1 ">
																	{c.postedBy.image &&
																	c.postedBy.image.url ? (
																		<Avatar
																			size={20}
																			src={
																				c.postedBy.image.url
																			}
																		/>
																	) : (
																		<Avatar
																			size={20}
																			icon={<UserOutlined />}
																		/>
																	)}
																</span>
																{c.postedBy.name}
															</span>
														</Link>

														<span className="ml-6 font-thin text-xs text-gray-500 ">
															{c.text}
														</span>
													</div>
													<div className="text-gray-400 text-xs">
														{moment(c.created).fromNow()}
													</div>
												</div>
											</li>
										))}
								</ul>
								<div className=" relative flex px-2 items-center">
									<InputEmoji
										value={comment}
										onChange={setComment}
										className="w-full  outline-none mr-1"
										placeholder="Add a comment"
										type="text"
									/>
									<span
										onClick={(e) => {
											if (!comment) return;
											// setCurrentPost(post);
											addComment(e, post._id);
										}}
										className={`font-bold  text-sky-200 ${
											comment && "text-sky-500 cursor-pointer"
										} `}
									>
										Post
									</span>
								</div>
							</div>
						)}
					</div>
				))}
		</>
	);
};
export default PostList;
