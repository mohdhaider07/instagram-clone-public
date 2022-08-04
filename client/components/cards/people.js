import { useState, useContext } from "react";
import { Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { UserContext } from "../../context";
const People = ({ people, handleFollow, handleUnfollow }) => {
	const [state] = useContext(UserContext);

	return (
		<div className=" w-[22rem] md:w-80">
			<div className="text-gray-500">Suggestions For You</div>
			{
				<List
					itemLayout="horizontal"
					dataSource={people}
					renderItem={(user) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Link href={`/user/${user._id}`}>
										<div className="items-center">
											{user.image ? (
												<Avatar src={user.image.url} />
											) : (
												<UserOutlined className="text-3xl -mt-3" />
											)}
										</div>
									</Link>
								}
								title={
									<div className="flex items-center justify-between ">
										<Link href={`/user/${user._id}`}>
											<span style={{ cursor: "pointer" }}>
												{user.name}
											</span>
										</Link>
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
											state &&
											state.user._id !== user._id && (
												<span
													style={{ cursor: "pointer" }}
													onClick={() => handleFollow(user._id)}
													className="bg-sky-500 text-white rounded-sm py-[3px] px-2 border-bg-sky-500 font-medium"
													href="#"
												>
													Follow
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
		</div>
	);
};
export default People;
