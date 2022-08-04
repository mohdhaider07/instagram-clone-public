import { useContext, useState } from "react";

import {
	HeartOutlined,
	HeartFilled,
	CommentOutlined,
	EditOutlined,
	DeleteOutlined,
	LoadingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import UserRoute from "../routes/UserRoute";
import { UserContext } from "../../context";
import { useRouter } from "next/router";

import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import SinglePost from "./SinglePost";
const PublicPost = ({ posts }) => {
	const [state, setState] = useContext(UserContext);
	const [showPost, setShowPost] = useState(false);
	const [id, setId] = useState(null);
	const router = useRouter();
	return (
		<>
			{posts &&
				posts.map((post) => (
					<div key={post._id} className="  ">
						<div className="relative h-[14rem] bg-white   flex justify-center items-center ">
							{post.image && post.image.url ? (
								<img
									onClick={() => {
										setShowPost(true);
										setId(post._id);
									}}
									src={post.image.url}
									className="h-full cursor-pointer object-cover"
									alt="post iamge"
								/>
							) : (
								<img
									className="h-full"
									src="../images/parrot.jpg"
									alt="image"
								/>
							)}
						</div>
					</div>
				))}

			<SinglePost
				showPost={showPost}
				setState={setState}
				state={state}
				setShowPost={setShowPost}
				_id={id}
			/>
		</>
	);
};
export default PublicPost;
