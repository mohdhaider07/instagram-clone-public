import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const UserRoute = ({ children }) => {
	const [ok, setOk] = useState(false);
	const router = useRouter();
	const [state] = useContext(UserContext);

	useEffect(() => {
		if (state && state.token) getCurrentUser();
	}, [state && state.token]);

	const getCurrentUser = async () => {
		try {
			const { data } = await axios.get(
				"https://sastagram-social-app.herokuapp.com/api/current-user"
			);
			// console.log(data);
			if (data.ok) setOk(true);
		} catch (err) {
			// console.log("err",err)
			router.push("/login");
		}
	};

	process.browser &&
		state == null &&
		setTimeout(() => {
			getCurrentUser();
		}, 8000);

	return !ok ? <LoadingOutlined className="flex h-24" /> : <>{children}</>;
};

export default UserRoute;
