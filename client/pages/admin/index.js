import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import AdminRoute from "../../components/routes/AdminRoute";
import axios from "axios";
import { toast } from "react-toastify";

// this page user can render if user is logedin

const DashBoard = () => {
	const [state, setState] = useContext(UserContext);

	// state
	const [deleteLoading, setDeleteLoading] = useState(false);
	//posts
	const [posts, setPosts] = useState([]);

	// console.log(state);
	useEffect(() => {
		if (state && state.token) {
			newsFeed();
		}
	}, [state && state.token]);

	const newsFeed = async () => {
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/posts`
			);
			// console.log("users posts",data);
			console.log(data);
			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	//************** Deleting the Post */

	const handleDelete = async (_id) => {
		// console.log("delete this post", _id);
		try {
			setDeleteLoading(true);
			const ans = window.confirm("Are you Sure you Want to Delete");
			if (!ans) return;
			const { data } = await axios.delete(
				`https://sastagram-social-app.herokuapp.com/api/admin/delete-post/${_id}`
			);
			//    console.log(data);
			if (data.ok) {
				toast.error("Post Deleted");
				setDeleteLoading(false);
				newsFeed();
			}
		} catch (err) {
			setDeleteLoading(false);
			console.log(err);
		}
	};

	return (
		<>
			<AdminRoute>
				<div className="flex justify-center items-center h-48 bg-parrot-img">
					<div className="">
						<h1 className="font-bold text-black text-4xl ">AdminPage</h1>
					</div>
				</div>
				<br />
				<div>
					{posts && posts[0] && posts[0].content}
					<button onClick={() => handleDelete(posts[0]._id)}>
						delete
					</button>
				</div>
			</AdminRoute>
		</>
	);
};
export default DashBoard;
