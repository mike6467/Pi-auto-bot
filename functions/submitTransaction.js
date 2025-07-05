const { Server, Transaction } = require("stellar-sdk");

exports.handler = async function(event) {
  try {
    const { xdr } = JSON.parse(event.body);

    if (!xdr) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing signed XDR"
        })
      };
    }

    // Connect to Pi Mainnet
    const server = new Server("https://api.mainnet.minepi.com");

    // Load transaction from signed XDR
    const transaction = new Transaction(xdr, "Pi Mainnet");

    // Attempt to submit transaction
    const response = await server.submitTransaction(transaction);

    // ✅ Log transaction success
    console.log("✅ Transaction successful:");
    console.log("Hash:", response.hash);
    console.log("Ledger:", response.ledger);
    console.log("Envelope XDR:", response.envelope_xdr);
    console.log("Result XDR:", response.result_xdr);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: response
      })
    };
  } catch (e) {
    // 🔥 Log detailed error information
    const reason = e?.response?.data?.extras?.result_codes || "Unknown error";

    console.error("🔥 Transaction failed:");
    console.error("Message:", e.message);
    console.error("Reason:", reason);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: e.message,
        reason
      })
    };
  }
};
