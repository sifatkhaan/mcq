"use client";

import { Input } from "antd";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Login</h1>
      <div>
        <Input type="text" placeholder="Enter Email" />
        <Input type="password" placeholder="Enter Password" />
      </div>
      <div>footer</div>
    </div>
  );
}
