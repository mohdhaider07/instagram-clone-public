import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import PostForm from "../../components/forms/PostForm";
import UserRoute from "../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Modal, Pagination } from "antd";
import People from "../../components/cards/people";
import FollowingPeople from "../../components/cards/followingPeople";
import FollowerPeople from "../../components/cards/followerPeople";
import CommentForm from "../../components/forms/CommentForm";
import AllComments from "../../components/cards/allComments";
import InfiniteScroll from "react-infinite-scroll-component";

import io from "socket.io-client";

const socket = io("https://sastagram-social-app.herokuapp.com/", {
	reconnection: true,
});
// this page user can render if user is logedin

const DashBoard = () => {
	const [state, setState] = useContext(UserContext);

	// state
	const [content, setContent] = useState();
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	//posts
	const [posts, setPosts] = useState([]);
	const [people, setpeople] = useState([]);

	const [followingPeople, setFollowingPeople] = useState([]);
	const [followerPeople, setFollowerPeople] = useState([]);
	// comments
	const [comment, setComment] = useState("");
	const [visible, setVisible] = useState(false);
	const [currentPost, setCurrentPost] = useState({});
	//pagination
	const [totalPosts, setTotalPosts] = useState(0);
	const [page, setPage] = useState(1);
	// router
	const router = useRouter();

	// console.log(state);
	useEffect(() => {
		if (state && state.token) {
			newsFeed();
			fetchFindPeople();
			// fetchFollowingPeople();
			// fetchFollowerPeople();
		}
	}, [state && state.token && page]);

	// useEffect(() => {
	// 	try {
	// 		axios
	// 			.get("https://sastagram-social-app.herokuapp.com/api/total-post")
	// 			.then(({ data }) => setTotalPosts(data));
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }, []);

	const newsFeed = async () => {
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/news-feed/${page}`
			);
			// console.log("users posts",data);
			console.log(data);
			// setPosts((prev) => {
			// 	prev, data;
			// });
			// const prevPosts =
			// 	posts &&
			// 	posts.map((p) => {
			// 		return {
			// 			...p,
			// 		};
			// 	});

			// console.log("delete", prevPosts);
			setPosts([...posts, ...data]);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchFindPeople = async () => {
		try {
			const { data } = await axios.get(
				"https://sastagram-social-app.herokuapp.com/api/find-people"
			);
			// console.log(data);

			{
				data && setpeople(data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	{
		/* this */
	}
	const handlePost = async (e) => {
		e.preventDefault();
		// console.log("post submited",content)
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/create-post",
				{ content, image }
			);
			// console.log("post craeted response=>",data);
			if (data.error) {
				toast.error(data.error);
			} else {
				toast.success("Poast created");
				setContent("");
				setImage({});
				setPage(1);
				newsFeed();
				// socket
				socket.emit("new-post", data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	{
		/* this */
	}
	const handleImage = async (e) => {
		// console.log("form submites")
		const file = e.target.files[0];
		let formData = new FormData();
		formData.append("image", file);

		// console.log("images=====>",[...formData]);
		try {
			setUploading(true);
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/upload-image",
				formData
			);
			// console.log("server side data",data);
			setImage({
				url: data.url,
				public_id: data.public_id,
			});
			setUploading(false);
		} catch (err) {
			setUploading(false);
			console.log(err);
		}
	};

	//************** Deleting the Post */

	const handleDelete = async (_id) => {
		// console.log("delete this post", _id);
		try {
			const ans = window.confirm("Are you Sure you Want to Delete");
			if (!ans) return;
			setDeleteLoading(true);
			const { data } = await axios.delete(
				`https://sastagram-social-app.herokuapp.com/api/delete-post/${_id}`
			);
			//    console.log(data);
			if (data.ok) {
				toast.error("Post Deleted");
				setTotalPosts(totalPosts - 1);
				const filteredPosts = posts.filter((p) => p._id !== _id);
				setPosts(filteredPosts);
				setDeleteLoading(false);
			}
		} catch (err) {
			setDeleteLoading(false);
			console.log(err);
		}
	};

	const handleFollow = async (_id) => {
		// console.log("follow this user=>",user);
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/user-follow",
				{ _id: _id }
			);
			// console.log("follow response", data);
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// people

			// render post of Followed people
		} catch (err) {
			console.log(err);
		}
	};

	// following
	// const fetchFollowingPeople = async () => {
	// 	try {
	// 		const { data } = await axios.get(
	// 			"http://localhost:8000/api/following-people"
	// 		);
	// 		// console.log(data);

	// 		{
	// 			data && setFollowingPeople(data);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const handleUnfollow = async (_id) => {
		// console.log("unfollow this user",user);
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/user-unfollow",
				{ _id: _id }
			);
			// console.log("follow response", data);
			let auth = JSON.parse(localStorage.getItem("auth"));
			auth.user = data;
			localStorage.setItem("auth", JSON.stringify(auth));
			// update context
			setState({ ...state, user: data });
			// people
			// let filterdFollowing = followingPeople.filter(
			// 	(p) => p._id !== user._id
			// );
			// // console.log("filter people", filterdPeople)
			// setFollowingPeople(filterdFollowing);
			// fetchFindPeople();

			// render post of Followed people
		} catch (err) {
			console.log(err);
		}
	};

	// const fetchFollowerPeople = async () => {
	// 	try {
	// 		const { data } = await axios.get(
	// 			"http://localhost:8000/api/follower-people"
	// 		);
	// 		// console.log(data);

	// 		{
	// 			data && setFollowerPeople(data);
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	// Like and comment

	// const handleLike = async (_id) => {
	// 	try {
	// 		const { data } = await axios.put(
	// 			"https://sastagram-social-app.herokuapp.com/api/like-post",
	// 			{ _id }
	// 		);

	// 		// console.log("liked",data);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	// const handleUnlike = async (_id) => {
	// 	try {
	// 		const { data } = await axios.put(
	// 			"https://sastagram-social-app.herokuapp.com/api/unlike-post",
	// 			{ _id }
	// 		);

	// 		// console.log("unliked",data);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };
	// comment

	const handleComment = (post) => {
		setCurrentPost(post);
		setVisible(true);
	};

	const addComment = async (e, _id) => {
		e.preventDefault();
		// console.log("comment",comment);
		// console.log("current post",currentPost);
		try {
			const { data } = _id
				? await axios.put(
						"https://sastagram-social-app.herokuapp.com/api/add-comment",
						{
							postId: _id,
							comment,
						}
				  )
				: await axios.put(
						"https://sastagram-social-app.herokuapp.com/api/add-comment",
						{
							postId: currentPost._id,
							comment,
						}
				  );

			const newPosts = posts.map((p) => {
				if (p._id === (_id || currentPost._id)) {
					let newPost = p;
					newPost.comments = data.comments;
					return newPost;
				} else {
					return p;
				}
			});
			setPosts(newPosts);
			console.log("add comment", data.comments);
			setComment("");
			setVisible(false);
		} catch (err) {
			console.log(err);
		}
	};
	const removeComment = async (postId, comment) => {
		let ans = window.confirm("Do you want to delete this comment?");
		if (!ans) return;
		try {
			const { data } = await axios.put(
				"https://sastagram-social-app.herokuapp.com/api/remove-comment",
				{
					postId,
					comment,
				}
			);

			const newPosts = posts.map((p) => {
				if (p._id === postId) {
					let newPost = p;
					newPost.comments = data.comments;
					return newPost;
				} else {
					return p;
				}
			});
			setVisible(false);
			setPosts(newPosts);
			console.log("removed comment", data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		state && state.user && state.user._id && noOfPosts();
	}, [state && state.user && state.user._id]);

	const noOfPosts = async () => {
		const _id = state && state.user && state.user._id;
		console.log(_id);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/noOfPosts",
				{ _id }
			);
			setTotalPosts(data);
			// console.log("length=>", data);
		} catch (err) {
			console.log(err);
		}
	};
	console.log(posts);
	return (
		<UserRoute>
			<div className="flex pb-12 bg-gray-200 min-h-screen justify-center">
				<div className="flex justify-center flex-wrap gap-6">
					<div className="md:grow  ">
						{/* <div>
							<PostForm
								handleImage={handleImage}
								handlePost={handlePost}
								content={content}
								setContent={setContent}
								uploading={uploading}
								image={image}
							/>
							<br />
						</div> */}
						<div className="flex justify-center">
							<div className="flex flex-col mt-8  items-center ">
								<InfiniteScroll
									dataLength={posts.length}
									next={() => setPage(page + 1)}
									hasMore={posts.length < totalPosts}
									loader={
										<h1 className="text-center my-4 font-semibold text-gray-600">
											Loading...
										</h1>
									}
								>
									{posts.length > 0 && (
										<PostList
											posts={posts}
											setPosts={setPosts}
											setPage={setPage}
											handleDelete={handleDelete}
											deleteLoading={deleteLoading}
											//like
											// handleLike={handleLike}
											// handleUnlike={handleUnlike}
											//comment
											comment={comment}
											setComment={setComment}
											addComment={addComment}
											handleComment={handleComment}
											setCurrentPost={setCurrentPost}
										/>
									)}
								</InfiniteScroll>

								{/* {!(posts.length > 0) ? (
										<div>No posts</div>
									) : (
										<Pagination
											current={page}
											total={(totalPosts / 2) * 10}
											onChange={(value) => setPage(value)}
										/>
									)} */}
							</div>
						</div>
					</div>
					{people && people.length > 0 && (
						<div className=" md:mt-8 rounded-md bg-white h-fit p-4 flex flex-col items-center   ">
							{/* <FollowingPeople
							people={followingPeople}
							handleUnfollow={handleUnfollow}
						/>
						<FollowerPeople
							people={followerPeople}
							handleFollow={handleFollow}
							handleUnfollow={handleUnfollow}
						/> */}

							<People
								people={people}
								handleUnfollow={handleUnfollow}
								handleFollow={handleFollow}
							/>
						</div>
					)}
				</div>
			</div>
			<Modal
				visible={visible}
				onCancel={() => setVisible(false)}
				title="Comment"
				footer={null}
			>
				<AllComments
					currentPost={currentPost}
					removeComment={removeComment}
				/>
				<CommentForm
					comment={comment}
					setComment={setComment}
					addComment={addComment}
				/>
			</Modal>
		</UserRoute>
	);
};
export default DashBoard;
