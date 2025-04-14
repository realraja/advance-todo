"use client";

import { useSelector } from "react-redux";

export default function Home() {

  const {isUser,userId,userData,loading} = useSelector((state) => state.auth);
// console.log(isUser,userId,userData,loading);


  return (
    <div>HOme</div>
  );
}
