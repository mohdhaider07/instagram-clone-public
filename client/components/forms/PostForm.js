import {
	CameraTwoTone,
	LoadingOutlined,
	CameraOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css";

const PostForm = (props) => {
	const {
		handlePost,
		page,
		content,
		setContent,
		handleImage,
		uploading,
		image,
	} = props;

	return (
		<div className=" flex  flex-col items-center justify-center ">
			<div className="h-12 flex bg-white justify-between mt-16 md:w-2/3 w-[25rem] rounded-t-2xl border-t border-l border-r ">
				<div className="flex-1"></div>
				<div className=" flex-1 flex justify-between">
					<span className="-ml-14 flex items-center font-semibold">
						{page === "upload" ? "Create new post" : "Edit post"}
					</span>
					<span className="flex items-center">
						<button
							onClick={handlePost}
							disabled={!content || uploading}
							className={`mr-4 ${
								!content || uploading ? "text-sky-300" : "text-sky-500"
							}   font-extrabold`}
						>
							Share
						</button>
					</span>
				</div>
			</div>
			<form
				className="sm:flex-row-reverse flex flex-col-reverse  md:w-2/3 w-[25rem] h-80   border "
				onSubmit={handlePost}
			>
				<div className=" border flex-1">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write a caption..."
						className="focus:outline-none bg-gray-100 p-4 h-full w-full"
					/>
				</div>

				<div className=" flex-1 bg-gray-50 flex justify-center items-center ">
					<label className="">
						{image && image.url ? (
							<div className="sm:h-80 h-40">
								<img
									className="cursor-pointer object-cover h-full "
									src={image.url}
								/>
							</div>
						) : uploading ? (
							<LoadingOutlined className=" text-4xl text-red-500 " />
						) : (
							<span className="flex text-4xl opacity-70 text-gray-400 ">
								<CameraOutlined
									style={{ cursor: "pointer" }}
									className="   flex justify-center "
								/>
							</span>
						)}

						<input
							onChange={handleImage}
							type="file"
							accept="images/*"
							hidden
						/>
					</label>
				</div>
			</form>
		</div>
	);
};

export default PostForm;
