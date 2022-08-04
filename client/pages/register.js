import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Modal } from "antd";
import { useRouter } from "next/router";
import Authform from "../components/forms/Authform";
import { UserContext } from "../context";
const Register = () => {
	const [state, setState] = useContext(UserContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [secret, setSecret] = useState("");
	const [ok, setOk] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(name,email,password,secret)
		try {
			setLoading(true);
			const { data } = await axios.post(
				`https://sastagram-social-app.herokuapp.com/api/register`,
				{
					name,
					email,
					password,
					secret,
				}
			);
			if (data.error) {
				toast.error(data.error);
				setLoading(false);
			} else {
				setOk(data.ok);
				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
			toast(err.response.data);
		}
	};

	return (
		<div className="flex flex-col h-screen items-center bg-white ">
			<div className="  h-fit   mt-8 px-8 py-4 border flex flex-col items-center">
				<div className="  w-64  ">
					<Authform
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
					/>
				</div>
			</div>
			<div className="mt-8 px-20 py-2 border">
				<Link href="/login">
					<p className="font-thin text-sm">
						Already have account?
						<a className="text-blue-800">Login</a>{" "}
					</p>
				</Link>
			</div>

			<div className="flex justify-center items-center ">
				<Modal
					title="Congratulations!"
					visible={ok}
					onCancel={() => setOk(false)}
					footer={null}
				>
					<h3>Successfully register</h3>
					<Link href="/login">
						<a className="px-2 py-1 text-white bg-black">login</a>
					</Link>
				</Modal>
			</div>
		</div>
	);
};
export default Register;
