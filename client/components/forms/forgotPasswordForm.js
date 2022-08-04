import { LoadingOutlined } from "@ant-design/icons";
const ForgotPasswordForm = (props) => {
	const {
		handleSubmit,
		email,
		setEmail,
		newPassword,
		setNewPassword,
		secret,
		setSecret,
		loading,
		page,
	} = props;
	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="mb-1">
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						id="email"
						className="input_box"
						placeholder="email"
						required
					/>
				</div>
				<div className="mb-1">
					<input
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						type="password"
						id="password"
						className="input_box"
						placeholder="New Password"
						required
					/>
				</div>

				<div className="mb-1">
					<input
						value={secret}
						onChange={(e) => setSecret(e.target.value)}
						type="text"
						className="input_box"
						placeholder="Your Secret"
						required
					/>
				</div>

				<button
					disabled={!secret || !newPassword || !email}
					className={` mt-2 mb-3 w-full text-white bg-sky-200   rounded-sm  p-[3px]  ${
						secret && newPassword && email && "hover:bg-sky-500"
					}`}
				>
					{page === "login" ? (
						loading ? (
							<LoadingOutlined />
						) : (
							"Login"
						)
					) : loading ? (
						<LoadingOutlined />
					) : (
						"Set New Password"
					)}
				</button>
			</form>
		</>
	);
};

export default ForgotPasswordForm;
