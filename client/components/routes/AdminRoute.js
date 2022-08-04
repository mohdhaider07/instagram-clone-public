import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const AdminRoute = ({ children }) => {
	const [ok, setOk] = useState(false);
	const router = useRouter();
	const [state] = useContext(UserContext);

	useEffect(() => {
		if (state && state.token) getCurrentAdmin();
	}, [state && state.token]);

	const getCurrentAdmin = async () => {
		try {
			const { data } = await axios.get(
				"https://sastagram-social-app.herokuapp.com/api/current-admin"
			);
			// console.log(data);
			if (data.ok) {
				setOk(true);
			}
		} catch (err) {
			console.log(" you are not admin err", err);
			router.push("/");
		}
	};

	process.browser &&
		state == null &&
		setTimeout(() => {
			getCurrentAdmin();
		}, 8000);

	return !ok ? <LoadingOutlined className="flex h-24" /> : <>{children}</>;
};

export default AdminRoute;
