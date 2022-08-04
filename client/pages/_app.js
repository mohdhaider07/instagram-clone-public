import { UserProvider } from "../context";
import Head from "next/head";
import Nav from "../components/Nav"; //nav bar in all the files
import { ToastContainer } from "react-toastify"; // for send notification
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css"; //for  UI design
import "../asset/css/global.css";
export default function App({ Component, pageProps }) {
	return (
		<UserProvider>
			<Head>
				<title> Sastagram </title>
				{/*css file in public forlder */}
			</Head>
			<ToastContainer position="top-right" />
			<Nav />
			<Component {...pageProps} />
		</UserProvider>
	);
}
