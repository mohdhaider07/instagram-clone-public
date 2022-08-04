import { useContext } from "react";
import { Avatar } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";
import moment from "moment";
const AllComments = ({ currentPost, removeComment }) => {
	const [state] = useContext(UserContext);
	return (
		<div className="  overflow-hidden	  ">
			{currentPost &&
				currentPost.comments &&
				currentPost.comments.length > 0 && (
					<div className=" bg-white rounded-lg shadow">
						<ul
							style={{ maxHeight: "400px", overflow: "scroll" }}
							className="divide-y-2 divide-gray-100"
						>
							{currentPost.comments.map((c) => (
								<li key={c.created} className="p-3">
									<div className="flex justify-between">
										<div>
											<span>
												<span className="mr-1">
													{c.postedBy.image &&
													c.postedBy.image.url ? (
														<Avatar
															size={20}
															src={c.postedBy.image.url}
														/>
													) : (
														<Avatar
															size={20}
															icon={<UserOutlined />}
														/>
													)}
												</span>
												{c.postedBy.name}
											</span>
											<br />
											<span>
												<i>{c.text}</i>
											</span>
										</div>
										<div>
											{moment(c.created).fromNow()}
											<br />
											{state &&
												state.user &&
												state.user._id == c.postedBy._id && (
													<span>
														<DeleteOutlined
															onClick={() =>
																removeComment(
																	currentPost._id,
																	c
																)
															}
															className="  text-red-500  p-1"
														/>
													</span>
												)}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
		</div>
	);
};
export default AllComments;
