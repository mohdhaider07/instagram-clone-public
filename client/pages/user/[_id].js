import { useRouter } from "next/router";
import axios from "axios";
import { Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState, useEffect, useContext } from "react";
import FollowerPeople from "../../components/cards/followerPeople";
import FollowingPeople from "../../components/cards/followingPeople";
import { UserContext } from "../../context";
import { toast } from "react-toastify";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { MdOutlineVideoLibrary, MdSave } from "react-icons/md";
import Link from "next/link";
import SinglePost from "../../components/cards/SinglePost";
import UserRoute from "../../components/routes/UserRoute";
const UserProfile = () => {
	const [state, setState] = useContext(UserContext);

	const [user, setUser] = useState();
	const [posts, setPosts] = useState();
	const [id, setId] = useState(null);
	const [visible, setVisible] = useState(false);
	const [selected, setSelected] = useState("post");
	const [click, setClick] = useState("");
	const [people, setPeople] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showPost, setShowPost] = useState(false);
	const [noOfFollower, setNoOfFollower] = useState(0);
	const [noOfFollowing, setNoOfFollowing] = useState(0);
	const router = useRouter();

	useEffect(() => {
		if (router.query._id) {
			fetchUser();
			fetchPost();
		}
	}, [router.query._id]);

	const fetchUser = async () => {
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/user/${router.query._id}`
			);
			// console.log("user data", data);
			setNoOfFollower(data.followers.length);
			setNoOfFollowing(data.following.length);
			setUser(data);
		} catch (err) {
			console.log(err);
		}
	};

	// following
	const fetchFollowingPeople = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/following-people",
				{ _id: router.query._id }
			);
			// console.log(data);

			data && setPeople(data);
			setLoading(false);
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	const fetchPost = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/singleuser-posts/${router.query._id}`
			);
			// console.log("user posts", data);
			setLoading(false);
			setPosts(data);
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};
	const fetchSavedPost = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/fetch-saved-post",
				{ _id: router.query._id }
			);

			setPosts(data);
			setLoading(false);
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	const fetchFollowerPeople = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post(
				"https://sastagram-social-app.herokuapp.com/api/follower-people",
				{ _id: router.query._id }
			);
			// console.log(data);

			data && setPeople(data);
			setLoading(false);
		} catch (err) {
			setLoading(false);
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
			// let filterdPeople = people.filter((p) => p._id !== user._id);
			// console.log("filter people", filterdPeople)
			// setpeople(filterdPeople);
			// fetchFollowingPeople();

			// render post of Followed people
			// newsFeed();
			// toast.success(`you started following ${user.name}`);
			state.user._id === router.query._id &&
				setNoOfFollowing(noOfFollowing + 1);
		} catch (err) {
			console.log(err);
		}
	};

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
			// let filterdFollowing = people.filter((p) => p._id !== user._id);
			// console.log("filter people", filterdPeople)
			// setPeople(filterdFollowing);
			// fetchFindPeople();

			// render post of Followed people
			// newsFeed();
			// toast.error(`Unfollowed ${user.name}`);
			state.user._id === router.query._id &&
				setNoOfFollowing(noOfFollowing - 1);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<UserRoute>
			<div className="ml-auto mr-auto overflow-hidden">
				<div className="flex mt-[5%]">
					<div className=" lg:ml-[22%] ml-[10%] mr-[5%] ">
						{user && user.image ? (
							<div className="h-28 w-28  rounded-full overflow-hidden">
								<img
									className="h-full w-full object-contain"
									src={user.image.url}
								/>
							</div>
						) : (
							<UserOutlined className="text-6xl border-[2px] rounded-full p-6" />
						)}
					</div>
					<div className="flex-flex-col space-y-4 w-80">
						<div className="flex sm:flex-row flex-col sm:items-center  justify-between">
							<span className="text-3xl text-gray-400 font-light">
								{user && user.username && user.username}
							</span>
							{state &&
								state.user &&
								state.user._id === router.query._id && (
									<Link href="/user/profile/update">
										<span className="p-1 cursor-pointer text-xs w-fit font-semibold text-center border">
											Edit profile
										</span>
									</Link>
								)}
						</div>
						<div className="flex sm:flex-row flex-col justify-between space-y-1  sm:space-y-0 sm:items-center">
							<span className="px-4 border w-fit">
								{" "}
								<span className="font-semibold">
									{posts && posts.length}
								</span>{" "}
								posts
							</span>
							<span
								className="hover:cursor-pointer  px-4 border w-fit"
								onClick={() => {
									fetchFollowerPeople();
									setClick("followers");
									setVisible(true);
								}}
							>
								<span className="font-semibold">{noOfFollower}</span>{" "}
								followers
							</span>
							<span
								className="hover:cursor-pointer  px-4 border w-fit"
								onClick={() => {
									setVisible(true);
									setClick("following");
									fetchFollowingPeople();
								}}
							>
								<span className="font-semibold">{noOfFollowing}</span>{" "}
								following
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">
								{user && user.name && user.name}
							</span>
							<span>{user && user.about && user.about}</span>
						</div>

						{state && state.user && state.user._id != router.query._id && (
							<div className="flex justify-end">
								{state &&
								state.user &&
								state.user.following &&
								state.user.following.includes(router.query._id) ? (
									<span
										style={{ cursor: "pointer" }}
										onClick={() => handleUnfollow(router.query._id)}
										className="text-black py-[1px] px-2 rounded-sm border font-medium"
										href="#"
									>
										Unfollow
									</span>
								) : (
									<span
										style={{ cursor: "pointer" }}
										onClick={() => handleFollow(router.query._id)}
										className="bg-sky-500 text-white rounded-sm py-[3px] px-2 border-bg-sky-500 font-medium"
										href="#"
									>
										Follow
									</span>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="mt-16">
					<div className="w-full mt-8 bg-gray-200 mx-[2%] h-[0.01rem]"></div>
					<div className="flex justify-center my-3 space-x-3">
						<span
							onClick={() => {
								setSelected("post");
								fetchPost();
							}}
							className={
								selected === "post"
									? "border-gray-400 cursor-pointer flex items-center  border-t -mt-3 pt-[11px] font-medium "
									: " font-medium cursor-pointer flex items-center"
							}
						>
							<span>
								<BsFillGrid3X3GapFill className="text-xs mr-1" />
							</span>{" "}
							POSTS
						</span>
						<span
							onClick={() => setSelected("videos")}
							className={
								selected === "videos"
									? "border-gray-400 cursor-pointer flex items-center border-t -mt-3 pt-[11px] font-medium "
									: " font-medium cursor-pointer flex items-center"
							}
						>
							<span>
								<MdOutlineVideoLibrary className="text-sm mr-1" />
							</span>{" "}
							VIDEOS
						</span>
						<span
							onClick={() => {
								setSelected("saved");
								fetchSavedPost();
							}}
							className={
								selected === "saved"
									? "border-gray-400 cursor-pointer border-t -mt-3 flex items-center pt-[11px] font-medium "
									: " font-medium cursor-pointer flex items-center"
							}
						>
							<span>
								<MdSave className="text-sm mr-1" />
							</span>{" "}
							SAVED
						</span>
					</div>
					<div className="flex mt-8 justify-center mx-4 ">
						{posts && posts.length > 0 && !loading ? (
							<div className="grid sm:grid-cols-3  grid-cols-2 md:gap-6 gap-3">
								{posts &&
									posts.map((p) => (
										<img
											onClick={() => {
												setShowPost(true);
												setId(p._id);
											}}
											key={p._id}
											className="h-60 cursor-pointer w-60 object-cover"
											src={`${
												p.image && p.image.url && p.image.url
											}`}
										/>
									))}
							</div>
						) : loading ? (
							<div>Loading..</div>
						) : (
							<div className="text-lg text-gray-300">No Posts</div>
						)}
					</div>
				</div>
			</div>

			<Modal
				visible={visible}
				onCancel={() => setVisible(false)}
				title={
					click === "followers"
						? `${noOfFollower} Followers`
						: `${noOfFollowing} Following`
				}
				footer={null}
			>
				{loading ? (
					<div className="text-md text-gray-400">Loading...</div>
				) : !loading && click === "followers" ? (
					<FollowerPeople
						people={people}
						handleFollow={handleFollow}
						handleUnfollow={handleUnfollow}
					/>
				) : (
					<FollowingPeople
						people={people}
						handleFollow={handleFollow}
						handleUnfollow={handleUnfollow}
					/>
				)}
			</Modal>

			<SinglePost
				showPost={showPost}
				_id={id}
				state={state}
				setState={setState}
				setShowPost={setShowPost}
			/>
		</UserRoute>
	);
};
export default UserProfile;
