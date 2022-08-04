import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context";
import PublicPost from "../components/cards/publicPost";
import Head from "next/head";
import io from "socket.io-client";
import { useRouter } from "next/router";
import UserRoute from "../components/routes/UserRoute";
const socket = io(
	"https://sastagram-social-app.herokuapp.com/",
	{ path: "/socket.io" },
	{
		reconnection: true,
	}
);

const Home = ({ posts }) => {
	const router = useRouter();

	const [state, setState] = useContext(UserContext);
	const [newsFeed, setNewsFeed] = useState([]);
	useEffect(() => {
		// console.log("SOCKET ON JOIN",socket);
		socket.on("receive-post", (newPost) => {
			// alert(newPost.postedBy.name);
			setNewsFeed([newPost, ...posts]);
		});
		// checkUser();
	}, []);

	// const checkUser = () => {
	// 	console.log(state.user);
	// 	if (!state || !state.user || !state.user._id) {
	// 		console.log(" I am here");
	// 		router.push("/login");
	// 	}
	// };

	const head = () => {
		<Head>
			<title> Instagram clone </title>
			<meta name="description" content="A social network for developer" />
			<meta
				property="og:description"
				content="A social network for developer"
			/>
			<meta property="og:tye" content="website" />
			<meta property="og:site_name" content="merncamp" />
			<meta property="og:url" content="http://merncamp.com" />
			<meta
				property="og:image:secure_url"
				content="http://merncamp.com/images/parrot.jpg"
			/>
		</Head>;
	};
	const collections = newsFeed.length > 0 ? newsFeed : posts;
	return (
		<UserRoute>
			{head()}
			<div className="text-center ">
				<div className=" bg-gray-100 min-h-screen  ">
					<div className="max-w-[60rem] px-2 grid grid-cols-2 mx-auto sm:grid-cols-3   gap-1 ">
						<PublicPost posts={collections} />
					</div>
				</div>
			</div>
		</UserRoute>
	);
};

export async function getServerSideProps(context) {
	const { data } = await axios.get(
		"https://sastagram-social-app.herokuapp.com/api/posts"
	);
	// console.log(data);
	return {
		props: { posts: data }, // will be passed to the page component as props
	};
}
export default Home;
