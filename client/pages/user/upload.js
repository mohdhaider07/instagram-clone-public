import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";
import PostForm from "../../components/forms/PostForm";
import UserRoute from "../../components/routes/UserRoute";
const socket = io("https://sastagram-social-app.herokuapp.com/", {
	reconnection: true,
});
const upload = () => {
	const [content, setContent] = useState("");
	const [uploading, setUploading] = useState(false);
	const [image, setImage] = useState({});

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
				// socket
				socket.emit("new-post", data);
			}
		} catch (err) {
			toast.error(err);
			console.log(err);
		}
	};

	const handleImage = async (e) => {
		// console.log("form submites")
		const file = e.target.files[0];
		let formData = new FormData();
		formData.append("image", file);
		console.log("i am here");
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
		<UserRoute>
			<div className="bg-black h-screen bg-opacity-80">
				<PostForm
					handleImage={handleImage}
					handlePost={handlePost}
					content={content}
					setContent={setContent}
					uploading={uploading}
					image={image}
					page="upload"
				/>
			</div>
		</UserRoute>
	);
};

export default upload;
