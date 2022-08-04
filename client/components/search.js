import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context";
import SearchResult from "./cards/searchResult";
const Search = ({ handleFollow, handleUnfollow }) => {
	const [state] = useContext(UserContext);
	const [query, setQuery] = useState("");
	const [result, setResult] = useState([]);
	const searchUser = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.get(
				`https://sastagram-social-app.herokuapp.com/api/search-user/${e.target.value}`
			);
			console.log("search data", data);
			setResult(data);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<input
				onChange={(e) => searchUser(e)}
				type="text"
				placeholder="Search"
				className="p-2 border"
			></input>

			{result.length > 0 && (
				<SearchResult
					people={result}
					handleFollow={handleFollow}
					handleUnfollow={handleUnfollow}
				/>
			)}
		</>
	);
};
export default Search;
