import { useState } from "react";
import RegForm from "../components/RegForm";
import Layout from "../components/Layout";
import axios from "axios";
import URLbaseAPI from "../utils/URLbaseAPI";
import { redirectAuthUser } from "../utils/functions";
import Loader from "../components/Loader/Loader";
import Router from "next/router";

const register = () => {
  const [inputField, setInputField] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLogging, setIsLogging] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState("");
  const [isSummitted, setIsSubmitted] = useState(false);
  const [errMsg, setErMsg] = useState("");

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputField.password && inputField.password.length < 6) {
      setIsError(true);
      setErMsg("password has to be six characters or more");
      return;
    }
    try {
      setIsLogging(true);
      setIsError(false);
      const { data } = await axios.post(`/api/users/signup`, {
        fullName: inputField.fullName,
        email: inputField.email,
        password: inputField.password,
        passwordConfirm: inputField.passwordConfirm,
      });
      setIsLogging(false);
      setIsSubmitted(true);
      setSubmittedMsg(data.message);
      Router.push("/login");
    } catch (er) {
      setIsLogging(false);

      setIsSubmitted(false);
      setErMsg(er.response.data.message);
      setIsError(true);
    }
  };

  return (
    <Layout>
      <div className="login">
        <div className="login__container">
          <div className="login__header">
            <div className="login__logword">REGISTER</div>

            <div className="login__text">Sign up with credentials</div>
          </div>
          <Loader />
          <div className="error">
            {isError ? <p className="errMsg"> {errMsg}</p> : ""}
          </div>
          {isSummitted ? (
            <div className="success">
              <p className="success__msg"> {submittedMsg}</p>
            </div>
          ) : (
            ""
          )}
          <RegForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            inputField={inputField}
            isError={isError}
            isLogging={isLogging}
          />
        </div>
        <div className="oneRow">
          <p>
            <a href="/login" className="oneRow__one">
              already have an account ? login
            </a>
          </p>
        </div>
      </div>

      <Loader />
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const token = req.cookies.token;

  if (token) {
    redirectAuthUser(token, ctx, "/dashboard");
  }

  return {
    props: {},
  };
}

export default register;
