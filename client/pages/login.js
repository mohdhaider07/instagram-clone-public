import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal } from "antd";

import Authform from "../components/forms/Authform";

const Login = () => {
	const [state, setState] = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [ok, setOk] = useState(false);

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		//  console.log(email,passwsord)
		try {
			setLoading(true);
			const { data } = await axios.post(
				`https://sastagram-social-app.herokuapp.com/api/login`,
				{
					email,
					password,
				}
			);
			// console.log(data);
			if (data.error) {
				toast.error(data.error);
				setLoading(false);
			} else {
				setLoading(false);
				setState({
					user: data.user,
					token: data.token,
				});
				window.localStorage.setItem("auth", JSON.stringify(data));
				router.push("/user/dashboard");
			}
		} catch (err) {
			setLoading(false);
			toast.error(
				err.response && err.response.data && err.response.data.message
					? err.response.data.message
					: err.message
			);
		}
	};

	useEffect(() => {
		checkUser();
	}, [state]);

	const checkUser = () => {
		console.log(state && state.user);
		if (state && state.user && state.user._id) {
			console.log(" I am here");
			router.push("/user/dashboard");
		}
	};
	// console.log(state);
	return (
		<>
			<div className="flex flex-col  h-screen  items-center  bg-white ">
				<div className=" h-fit mt-8 px-8 py-4 border  ">
					<div className=" w-64 ">
						<Authform
							handleSubmit={handleSubmit}
							email={email}
							setEmail={setEmail}
							password={password}
							setPassword={setPassword}
							loading={loading}
							setLoading={setLoading}
							page="login"
						/>
					</div>
				</div>

				<div className="mt-8 px-20 py-2 border ">
					<Link href="/register">
						<p className="font-thin text-sm">
							Don't have account?{" "}
							<a className="text-blue-800 ">Register</a>{" "}
						</p>
					</Link>
				</div>
			</div>
		</>
	);
};
export default Login;
