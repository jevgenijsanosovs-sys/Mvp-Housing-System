import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  buttonStyle,
  inputStyle,
} from "../styles/theme";

export default function LoginPage() {

  const { login } = useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const submit = async () => {

    const ok = await login(
      email,
      password
    );

    if (!ok) {
      return;
    }

    navigate("/");
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <div
        style={{
          width: 400,
          padding: 30,
          border: "1px solid #ccc",
          borderRadius: 10,
          justify-content: center;
        }}
      >

        <h1>
          <p style="line-height: 1.5">MVX Housing System
          <br></br>
          DzĪKS IRLAVA 20</p>
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={submit}
          style={buttonStyle}
        >
          Login
        </button>

      </div>

    </div>

  );
}
