import { DAppConnector } from "@hashgraph/hedera-wallet-connect";
import { useState } from "react";

// import signer form hashgraph
import {
  Signer,
  Client,
  TransactionId,
  TransferTransaction,
  Hbar,
} from "@hashgraph/sdk";

const appMetadata = {
  name: "Kabila",
  description:
    "Kabila App is a Web3 platform to help creators and brands better connect, share, finance, decide and prosper alongside their communities.",
  icon: "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z65394b9a6be938a2826f021c_f112ca0ce373df72f_d20230210_m082655_c005_v0501005_t0013_u01676017615965",
};

// FILL THIS WITH YOUR ACCOUNT ID AND OPERATOR KEY
const accountId = "";
const network = "";

const validHbar = (hbars) => {
  return typeof hbars == "number"
    ? new Hbar(hbars.toFixed(6))
    : new Hbar(Number(hbars).toFixed(6));
};

function Dapp() {
  const [connector, setConnector] = useState(
    /** @type {DAppConnector} */ (null)
  );

  const [trxSuccess, setTrxSuccess] = useState(false);

  const handleInit = async () => {
    const _connector = new DAppConnector(appMetadata);
    await _connector.init(["session_request"]);
    setConnector(_connector);
    console.log("_connector", _connector);
  };

  const handleConnect = async () => {
    const connectRes = await connector.connect(network);
    console.log("Connnect response: ", connectRes);
  };

  const handleSendHbarTrx = async () => {
    const signers = connector.getSigners();
    console.log("signer: ", signers);
    /** @type {Signer} */
    const signer = signers[0];

    const client = Client.forName(network);
    const hbarAmount = validHbar(9);
    let transId = TransactionId.generate(accountId);
    const trans = new TransferTransaction()
      .setMaxTransactionFee(new Hbar(5))
      .addHbarTransfer(accountId, hbarAmount.negated()) // Sending account
      .addHbarTransfer("0.0.8000", hbarAmount) // Receiving account
      .setTransactionMemo("HWC - trx example")
      .setTransactionId(transId)
      .freezeWith(client);

    const trx = await signer.signTransaction(trans);
    const result = await trx.execute(client);
    const receipt = await result.getReceipt(client);
    console.log("receipt: ", receipt);
    setTrxSuccess(true);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleInit()}> - init - </button>
        <button onClick={() => handleConnect()}> - Connect - </button>
        <button onClick={() => handleSendHbarTrx()}> - Send Hbar trx - </button>
      </div>
      {trxSuccess && <span> Send Success</span>}
    </div>
  );
}

export default Dapp;
