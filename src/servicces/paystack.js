// import axios from 'axios'
import dontenv from 'dotenv';

dontenv.config()

const { AUTH_OPTION = 'Bearer', PAYSTACK_SECRETE } = process.env;
const listBanks = 'https://api.paystack.co/bank'
const validateAccount = "https://api.paystack.co/bank/resolve";
export const cardPayment = 'https://api.paystack.co/transaction/initialize';



export const response = async (url, paymentData) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRETE}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!res.ok) {
    // Handle HTTP errors
    const errorData = await res.json();
    throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message || 'Unknown error'}`);
  }

  return await res.json();
};



export const banks = async () => {
  try {
    const response = await fetch(listBanks, {
      method: "GET",
      headers: {
        Authorization: `${AUTH_OPTION} ${PAYSTACK_SECRETE}`,
      },
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      console.log("Error fetching banks:", errorData.message || "Unknown error");
      return [];
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error fetching banks:", error.message);
    return [];
  }
};




export const verifyAccount = async (data) => {
  try {
    console.log("data", data, PAYSTACK_SECRETE);

    const response = await fetch(
      `${validateAccount}?account_number=${data.accountNumber}&bank_code=${data.bankCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRETE}`,
        },
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      console.log("Error verifying account:", errorData.message.split(". ")[0]);
      return errorData.message.split(". ")[0];
    }

    const accountData = await response.json();
    console.log("Account Name:", accountData.data.account_name);
    console.log("Bank Name:", accountData.data.bank_name);
    return accountData.data;
  } catch (error) {
    console.log("Error verifying account:", error.message);
    return error.message;
  }
};


export const createRecipient = async (accountNumber, bankCode, accountName) => {
  try {
    const response = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRETE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "nuban",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      console.error("Error creating recipient:", errorData);
      throw new Error(
        `Failed to create recipient with status ${response.status}: ${errorData.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.data.recipient_code;
  } catch (error) {
    console.error("Error creating recipient:", error.message);
    throw error;
  }
};



export const payout = async (recipientCode, amount) => {
  try {
    const response = await fetch("https://api.paystack.co/transfer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRETE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount * 100,
        recipient: recipientCode,
        reason: "Payment for services",
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      console.log("Error making transfer:", errorData);
      throw new Error(
        `Transfer failed with status ${response.status}: ${errorData.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Transfer Successful:", data);
    return data;
  } catch (error) {
    console.log("Error making transfer:", error.message);
  }
};



export const payWithCard = async (paymentData) => {
  const paymentPayload = {
    ...paymentData,
    metadata: {
      reason: paymentData.reason,
      requestId: paymentData.Id,
    },
  };
  const res = await response(cardPayment, paymentPayload);
  return res;
};