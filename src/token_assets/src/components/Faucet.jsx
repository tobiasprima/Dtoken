import React, { useState } from "react";
import { token, canisterId, createActor } from "../../../declarations/token/index";
import { AuthClient } from "../../../../node_modules/@dfinity/auth-client/lib/cjs/index";

function Faucet(props) {

  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Gimme Gimme");

  async function handleClick(event) {
    setDisabled(true);
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const result = await authenticatedCanister.payOut();
    setButtonText(result);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DBEY tokens here! Claim 10,000 DBEY coins to your principal Id({props.userPrincipal}.)</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
