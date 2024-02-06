import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { canisterId, createActor } from "../../../declarations/token/index";
import { AuthClient } from "../../../../node_modules/@dfinity/auth-client/lib/cjs/index";

function Transfer() {
  const [recipientId, setRecipientId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [resultText, setResultText] = useState("");
  const [isHidden, setHidden] = useState(true);
  
  async function handleClick() {
    setHidden(true);
    const Recipient = Principal.fromText(recipientId)
    const amount = Number(transferAmount)
    setDisabled(true);
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity()
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });
    const result = await authenticatedCanister.transfer(Recipient, amount);
    setResultText(result);
    setDisabled(false);
    setHidden(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e)=> setRecipientId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={transferAmount}
                onChange={(e)=> setTransferAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled} >
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{resultText}</p>
      </div>
    </div>
  );
}

export default Transfer;
