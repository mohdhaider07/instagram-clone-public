import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
const Authform = (props) => {
	const {
		handleSubmit,
		name,
		setName,
		email,
		setEmail,
		password,
		setPassword,
		secret,
		setSecret,
		loading,
		page,
		about,
		setAbout,
		username,
		setUsername,
		profileUpdate,
	} = props;
	return (
		<div>
			<div
				className={
					page === "login"
						? "flex justify-center mt-8 mb-8"
						: "flex justify-center mt-8 mb-4"
				}
			>
				<img
					className="w-40"
					src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
				/>
			</div>
			{page !== "login" && !profileUpdate && (
				<div className=" mb-4 text-gray-600 font-semibold text-center">
					<p>Sign up to see photos and videos from your friends.</p>
				</div>
			)}
			<form onSubmit={handleSubmit}>
				{profileUpdate && (
					<div className="mb-1">
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							type="text"
							className="input_box"
							placeholder="Username"
						/>
					</div>
				)}
				{profileUpdate && (
					<div className="mb-1">
						<input
							value={about}
							onChange={(e) => setAbout(e.target.value)}
							type="text"
							className="input_box"
							placeholder="About"
						/>
					</div>
				)}
				{page !== "login" && (
					<div className="mb-1">
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							type="text"
							className="input_box"
							placeholder="Name"
							required
						/>
					</div>
				)}
				<div className="mb-1">
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						id="email"
						disabled={profileUpdate}
						className="input_box"
						placeholder="email"
						required
					/>
				</div>
				<div className="mb-1">
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						id="password"
						className="input_box"
						placeholder="Password"
					/>
				</div>
				{page !== "login" && (
					<div className="mb-1">
						<input
							value={secret}
							onChange={(e) => setSecret(e.target.value)}
							type="text"
							className="input_box"
							placeholder="By Using this Reset password if forgotten"
							required
						/>
					</div>
				)}
				{page !== "login" && !profileUpdate && (
					<div className=" mt-4 mb-4 text-gray-600 text-center">
						<p className=" text-[12px] leading-3 px-1 ">
							People who use our service may have uploaded your contact
							information to Instagram.{" "}
							<span className="font-semibold">Learn More</span>
							<br />
							<br />
							By signing up, you agree to our Terms ,
							<span className="font-semibold">
								Data Policy and Cookies Policy .
							</span>
						</p>
					</div>
				)}
				{!profileUpdate && (
					<button className="mt-2 mb-3 w-full text-white bg-sky-200 hover:bg-sky-500 rounded-sm  p-[3px]">
						{page === "login" ? (
							loading ? (
								<LoadingOutlined />
							) : (
								"Log In"
							)
						) : loading ? (
							<LoadingOutlined />
						) : (
							"Sign Up"
						)}
					</button>
				)}
				{profileUpdate && (
					<button
						className={`mt-2 mb-3 w-full text-white bg-sky-200 hover:bg-sky-500 rounded-sm  p-[3px]`}
					>
						{" "}
						{loading ? <LoadingOutlined /> : "Update"}
					</button>
				)}{" "}
				<br />
				{page === "login" && (
					<div className="flex items-center justify-center">
						<div className="w-1/3 bg-gray-300 h-[0.1rem] rounded-xl "></div>
						<p className="mx-5 font-bold text-gray-500">OR</p>
						<div className="w-1/3 bg-gray-300 h-[0.1rem] rounded-xl  "></div>
					</div>
				)}
				{page === "login" && (
					<div className="mb-4 mt-8 text-xs font-thin flex justify-center">
						<Link href="/forgot-password">
							<p>
								<a className="text-blue-800">Forget Password? </a>{" "}
							</p>
						</Link>
					</div>
				)}
			</form>
		</div>
	);
};

export default Authform;
