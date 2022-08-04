import { useState, useContext } from "react";
import { Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { UserContext } from "../../context";
const FollowingPeople = ({ people, handleUnfollow, handleFollow }) => {
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
									<Link href={`/user/${user._id}`}>
										<div className="items-center">
											{user.image ? (
												<Avatar src={user.image.url} />
											) : (
												<UserOutlined className="text-xl -mt-2" />
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
											state.user._id !== user._id && (
												<span
													style={{ cursor: "pointer" }}
													onClick={() => handleFollow(user._id)}
													className="bg-sky-500 text-white rounded-sm py-[3px] px-2 border-bg-sky-500 font-medium"
													href="#"
												>
													Followback
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
export default FollowingPeople;
