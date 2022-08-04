import { useState, useContext } from "react";
import { Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";
import Link from "next/link";
const SearchResult = ({ people, handleFollow, handleUnfollow }) => {
	const [state] = useContext(UserContext);
	return (
		<>
			{
				<List
					itemLayout="horizontal"
					dataSource={people}
					renderItem={(user) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<div className="cursor-pointer items-center">
										{user.image ? (
											<Link href={`/user/${user._id}`}>
												<Avatar src={user.image.url} />
											</Link>
										) : (
											<Link href={`/user/${user._id}`}>
												<UserOutlined className="text-2xl" />
											</Link>
										)}
									</div>
								}
								title={
									<div className="flex items-center justify-between ">
										<span style={{ cursor: "pointer" }}>
											<Link href={`/user/${user._id}`}>
												<span>{user.name}</span>
											</Link>
										</span>
										{state &&
										state.user &&
										state.user.following.includes(user._id) ? (
											<span
												style={{ cursor: "pointer" }}
												onClick={() => handleUnfollow(user._id)}
												className="text-black py-[1px] px-2 rounded-sm border font-medium"
												href="#"
											>
												Unfollow
											</span>
										) : (
											state.user._id !== user._id && (
												<span
													style={{ cursor: "pointer" }}
													onClick={() => handleFollow(user._id)}
													className="bg-sky-500 text-white rounded-sm py-[3px] px-2 border-bg-sky-500 font-medium"
													href="#"
												>
													follow
												</span>
											)
										)}
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			}
		</>
	);
};
export default SearchResult;
