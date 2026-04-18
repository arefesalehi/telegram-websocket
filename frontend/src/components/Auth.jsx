import React, { useState } from "react";
import "./../../public/css/auth.css";

import { useNavigate } from "react-router-dom";

function Auth() {


    
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const authUser = async (event) => {
    event.preventDefault();

    const user = {
      username,
      phone,
    };

    const res = await fetch("http://localhost:4003/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status === 200 || res.status === 201) {
      const data = await res.json();

       console.log("AUTH USER:", data);
   

      navigate("/");
   


    }
  };

  return (
    <form className="box" action="" method="POST" target="_self">
      <h1>login</h1>
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        name="name"
        id="username"
        placeholder="Username"
        autoComplete="off"
      />
      <input
        type="text"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        name="phone"
        id="phone"
        placeholder="Phone"
        autoComplete="off"
      />
      <input
        type="submit"
        id="submit"
        value="Register / Login"
        onClick={authUser}
      />
    </form>
  );
}

export default Auth;
