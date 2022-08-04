import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
	HomeOutlined,
	HomeFilled,
	UserOutlined,
	CompassOutlined,
	CompassFilled,
	LogoutOutlined,
} from "@ant-design/icons";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import SearchResult from "./cards/searchResult";
import axios from "axios";

const Nav = () => {
	const [current, setCurrent] = useState("");
	const [state, setState] = useContext(UserContext);
	const [query, setQuery] = useState("");
	const router = useRouter();
	const [result, setResult] = useState([]);

	useEffect(() => {
		process.browser && setCurrent(window.location.pathname);
		// console.log("current=>",current);
	}, [process.browser && window.location.pathname]);

	const logout = () => {
		window.localStorage.removeItem("auth");
		setState(null);
		router.push("/login");
	};

	const searchUser = async (e) => {
		e.preventDefault();
		let query = e.target.value;
		if (!query || query === " ") {
			setResult([]);
			return;
		}
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/search-user/${query}`
			);
			console.log("search data", data);
			setResult(data);
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
		} catch (err) {
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
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<div className="  border-b   bg-white shadow-md py-2">
			<div className="  text-black max-w-[60rem] mx-auto flex items-center justify-between space-x-9 ">
				<div>
					<img
						className="h-8 ml-2"
						src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
						alt="Logo"
					/>
				</div>

				{state && state.user && state.token && (
					<>
						{/* Searchbox */}
						<div className="hidden sm:block">
							<input
								onChange={(e) => searchUser(e)}
								type="text"
								className="p-2 relative w-[20rem] border focus:outline-none bg-gray-100 rounded-md "
								placeholder="Search"
							/>
							{result.length > 0 && (
								<div className="absolute p-4 w-[20rem] shadow-md bg-white">
									<SearchResult
										people={result}
										handleFollow={handleFollow}
										handleUnfollow={handleUnfollow}
									/>
								</div>
							)}
						</div>
						<div className="flex space-x-6 items-center">
							<div className="">
								<Link href="/">
									{current === "/" ? (
										<a className="text-black text-xl flex hover:text-black">
											<CompassFilled />
										</a>
									) : (
										<a className="text-black text-xl flex hover:text-black">
											<CompassOutlined />
										</a>
									)}
								</Link>
							</div>
							<div className="">
								<Link href="/user/upload">
									<a className="text-black text-xl flex hover:text-black">
										<img className="h-6" src="../images/upload.png" />
									</a>
								</Link>
							</div>
							<div>
								{state && state.user && state.token && (
									<>
										<Link href="/user/dashboard">
											{current === "/user/dashboard" ? (
												<a className="text-black flex text-xl  hover:text-black">
													<HomeFilled />
												</a>
											) : (
												<a className="text-black flex text-xl hover:text-black">
													<HomeOutlined />
												</a>
											)}
										</Link>
									</>
								)}
							</div>
							{state &&
								state.user &&
								state.token &&
								state.user.role === "Admin" && (
									<div>
										<Link href="/admin">
											<a
												className={` ${
													current === "/admin" &&
													"border-b-2 border-cyan-500"
												}`}
											>
												Admin
											</a>
										</Link>
									</div>
								)}
							<div>
								{state && state.user && state.token && state.user._id && (
									<Link href={`/user/${state.user._id}`}>
										<a className="text-black flex text-xl hover:text-black">
											<UserOutlined />
										</a>
									</Link>
								)}
							</div>

							<div>
								<a
									onClick={logout}
									className="text-black mr-2 flex text-xl  hover:text-black"
								>
									<LogoutOutlined />
								</a>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
export default Nav;
