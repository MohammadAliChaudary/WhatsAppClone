import { useEffect, useState } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import Container from "../../components/container";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = ({ isLoginForm = false }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    ...(!isLoginForm && {
      fullName: "",
      confirmPassword: "",
    }),
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:3000/api/${isLoginForm ? "login" : "register"}`,
        data
      );

      console.log("res >>>", res.status);

      if (res.data.token) {
        localStorage.setItem("user:token", res.data.token);
        localStorage.setItem("user:detail", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      alert("invalid cradentials");
      console.log("error >>>", error);
    }
  };

  return (
    <Container>
      <div className="w-[600px] h-[800px] bg-white shadow-lg rounded">
        <div className="h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold ">
            {" "}
            {isLoginForm ? "Welcome Back" : "Welcome"}
          </h1>
          <p className="text-2xl mb-2 font-semibold mt-[10px]">
            {isLoginForm ? "Sign in to get updates" : "Sign up to explore"}
          </p>
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className=" flex flex-col justify-center items-center w-full"
          >
            {!isLoginForm ? (
              <Input
                placeholder={"John Doe"}
                type={"text"}
                label={"Full Name"}
                containerClass={"w-[75%]"}
                value={data.fullName}
                onChange={(e) => {
                  setData({ ...data, fullName: e.target.value });
                }}
              />
            ) : null}
            <Input
              placeholder={"john@example.com"}
              type={"email"}
              label={"email"}
              containerClass={"w-[75%]"}
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
            <Input
              placeholder={"Password"}
              type={"password"}
              label={"Password"}
              containerClass={"w-[75%]"}
              autoComplete={"false"}
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />

            {!isLoginForm ? (
              <Input
                placeholder={"Retype Your Password"}
                type={"password"}
                label={"Confirm Password"}
                containerClass={"w-[75%]"}
                autoComplete={"false"}
                value={data.confirmPassword}
                onChange={(e) => {
                  setData({ ...data, confirmPassword: e.target.value });
                }}
              />
            ) : null}
            <Button
              label={isLoginForm ? "Login" : "Register"}
              type={"submit"}
              customClass={"w-[75%] mt-4 bg-[#0000]"}
              disabled={
                isLoginForm ? false : !(data.password === data.confirmPassword)
              }
            />
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Form;
