import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Modal } from "antd";

import ForgotPasswordForm from "../components/forms/forgotPasswordForm";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [secret, setSecret] = useState("");
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(email,newPassword,secret)
		try {
			setLoading(true);
			const { data } = await axios.post(
				`https://sastagram-social-app.herokuapp.com/api/forgot-password`,
				{
					email,
					newPassword,
					secret,
				}
			);
			setLoading(false);
			// console.log("forgot password craeted response=>",data);
			if (data.error) {
				toast.error(data.error);
			} else {
				setOk(true);
				toast.success("Password changed");
			}
		} catch (error) {
			setLoading(false);
			toast(error.response.data);
		}
	};

	return (
		<div className="h-screen flex flex-col items-center">
			<div className=" h-fit mt-8 px-8 py-4 border">
				<div className="flex flex-col text-center items-center ">
					<img className="h-20" src="./images/lock.png" />
					<h3 className="my-2 text-base font-semibold ">
						Trouble Logging In?
					</h3>
					<p className="mb-4 w-64 leading-4 text-gray-400 text-xs">
						Enter your email and enter the secret that you entered at the
						creating your account.
					</p>
				</div>
				<div className=" w-64 ">
					<ForgotPasswordForm
						handleSubmit={handleSubmit}
						email={email}
						setEmail={setEmail}
						newPassword={newPassword}
						setNewPassword={setNewPassword}
						secret={secret}
						setSecret={setSecret}
						loading={loading}
					/>

					<div class="flex my-4 items-center justify-center">
						<div class="w-1/3 bg-gray-300 h-[0.1rem] rounded-xl "></div>
						<p class="mx-5 font-bold text-gray-500">OR</p>
						<div class="w-1/3 bg-gray-300 h-[0.1rem] rounded-xl  "></div>
					</div>

					<div className="flex justify-center">
						<Link href="/register">
							<p className="font-semibold">Create New Account</p>
						</Link>
					</div>
				</div>
				<div className=" my-2 p-1 bg-gray-100 border text-center">
					<Link href="/login">
						<p className="font-semibold cursor-pointer">Back to Login</p>
					</Link>
				</div>
			</div>

			<div className="flex justify-center items-center ">
				<Modal
					title="Congratulations!"
					visible={ok}
					onCancel={() => setOk(false)}
					footer={null}
				>
					<h3>Successfully Password has been changed!</h3>
					<Link href="/login">
						<a className="px-2 py-1 text-white bg-black">login</a>
					</Link>
				</Modal>
			</div>
		</div>
	);
};
export default ForgotPassword;
