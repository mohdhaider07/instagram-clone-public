import dynamic from "next/dynamic";
const InputEmoji = dynamic(() => import("react-input-emoji"), { ssr: false });
const CommentForm = ({ comment, setComment, addComment }) => {
	return (
		<>
			<form onSubmit={addComment}>
				<div className="flex flex-col">
					<InputEmoji
						className="my-2 p-2  outline-none border focus:border-gray-300 bg-gray-100 "
						type="text"
						value={comment}
						onChange={setComment}
						placeholder="Write something here.."
					></InputEmoji>
					<button
						disabled={!comment}
						className="p-1 text-white bg-sky-600 "
					>
						Submit
					</button>
				</div>
			</form>
		</>
	);
};
export default CommentForm;
