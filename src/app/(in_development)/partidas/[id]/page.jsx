import React from "react";

const page = async ({ params }) => {
  const user_id = await params;

  return <div>{user_id}</div>;
};

export default page;
