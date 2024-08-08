import React from "react";
import { useHistory } from 'react-router-dom';
import BusinessLoginForm from "../BusinessLoginForm/BusinessLoginForm";
import TheRippleBusiness from "../TheRippleBusiness/TheRippleBusiness"


function BusinessLogin() {

    const history = useHistory();

  return (
    <div>
        <h></h>
          <TheRippleBusiness/>
      <BusinessLoginForm />
     <center> <button
        type="button"
        className="btn btn_asLink"
        onClick={() => {
          history.push("/business-reg");
        }}
      >
        Register a Business
      </button></center>
      <p></p>
      <center> <button
        type="button"
        className="btn btn_asLink"
        onClick={() => {
          history.push("/login");
        }}
      >
        Back to User Portal
      </button></center>
      <p></p>
    </div>
  );
}

export default BusinessLogin;
