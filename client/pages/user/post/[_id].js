import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context";
import PostForm from "../../../components/forms/PostForm";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

// this page user can render if user is logedin

const EditPost = () => {
	const [state, setState] = useContext(UserContext);

	// state
	const [content, setContent] = useState();
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);

	// router
	const router = useRouter();

	const _id = router.query._id;

	useEffect(() => {
		if (_id) fetchPost();
	}, [_id]);

	const fetchPost = async () => {
		try {
			setUploading(true);
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/user-post/${_id}`
			);
			// console.log(data);
			{
				data && data.content && setContent(data.content);
			}
			// setImage({})
			{
				data && data.image && setImage(data.image);
			}
			setUploading(false);
		} catch (err) {
			setUploading(false);
			console.log(err);
		}
	};

	const handlePost = async (e) => {
		e.preventDefault();
		// console.log("edit post  submited", content)
		try {
			const { data } = await axios.put(
				`https://sastagram-social-app.herokuapp.com/api/update-post/${_id}`,
				{ content, image }
			);

			console.log("post craeted response=>", data);

			if (data.error) {
				toast.error(data.error);
			} else {
				toast.success("Poast Updated");
				router.push("/user/dashboard");
			}
		} catch (err) {
			console.log(err);
		}
	};

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

	return (
		<>
			<UserRoute>
				<div className="flex m-2">
					<div className="grow  ">
						<div className="flex flex-col  justify-center">
							<PostForm
								handleImage={handleImage}
								handlePost={handlePost}
								content={content}
								setContent={setContent}
								uploading={uploading}
								image={image}
							/>
							<br />
						</div>
					</div>
				</div>
			</UserRoute>
		</>
	);
};
export default EditPost;
