import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Modal, Avatar } from "antd";
import { CameraTwoTone, LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../../context";

import Authform from "../../../components/forms/Authform";

const ProfileUpdate = () => {
	//state
	const [state, setState] = useContext(UserContext);

	const [username, setUsername] = useState("");
	const [about, setAbout] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [secret, setSecret] = useState("");
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	// image
	const [image, setImage] = useState({});
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (state && state.user) {
			setUsername(state.user.username);
			setAbout(state.user.about);
			setName(state.user.name);
			setEmail(state.user.email);
			state.user.image && setImage(state.user.image);
		}
	}, [state && state.user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(name,email,password,secret)
		try {
			setLoading(true);
			const { data } = await axios.put(
				`https://sastagram-social-app.herokuapp.com/api/profile-update`,
				{
					username,
					about,
					name,
					email,
					password,
					secret,
					image,
				}
			);
			setLoading(false);
			if (data.error) {
				toast.error(data.error);
			} else {
				// update local storage update user keet token
				let auth = JSON.parse(localStorage.getItem("auth"));
				auth.user = data;
				localStorage.setItem("auth", JSON.stringify(auth));
				// update context
				setState({ ...state, user: data });

				setOk(true);
			}
		} catch (err) {
			setLoading(false);
			toast(err.response.data);
		}
	};

	// image upload
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
			<div className="flex h-screen justify-center bg-white py-4 ">
				<div className=" h-fit mt-8 px-8 py-4 border  ">
					<div className=" w-64 ">
						<label className="my-2">
							{image && image.url ? (
								<Avatar size="large" src={image.url} />
							) : uploading ? (
								<LoadingOutlined
									size="large"
									className="  text-red-500 "
								/>
							) : (
								<CameraTwoTone
									size="large"
									className=" text-red-500 "
								/>
							)}
							<input
								onChange={handleImage}
								type="file"
								accept="images/*"
								hidden
							/>
						</label>

						<Authform
							about={about}
							setAbout={setAbout}
							username={username}
							setUsername={setUsername}
							handleSubmit={handleSubmit}
							name={name}
							setName={setName}
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							secret={secret}
							setSecret={setSecret}
							loading={loading}
							profileUpdate={true}
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-center items-center ">
				<Modal
					title="Congratulations!"
					visible={ok}
					onCancel={() => setOk(false)}
					footer={null}
				>
					<h3>Successfully Updated</h3>
				</Modal>
			</div>
		</>
	);
};
export default ProfileUpdate;
