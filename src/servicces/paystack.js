// import axios from 'axios'
import dontenv from 'dotenv';

dontenv.config()

const { AUTH_OPTION = 'Bearer', PAYSTACK_SECRETE } = process.env;
const listBanks = 'https://api.paystack.co/bank'
const validateAccount = "https://api.paystack.co/bank/resolve";
export const cardPayment = 'https://api.paystack.co/transaction/initialize';



export const response = async (url, paymentData) => {
  const res = await axios.post(url, paymentData, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRETE}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};


export const banks = async () => {
    try {
      const response = await axios.get(listBanks, {
        headers: {
          Authorization: `${AUTH_OPTION} ${PAYSTACK_SECRETE}`,
        },
      });
  
      return response.data.data;
    } catch (error) {
      console.log(
        'Error fetching banks:',
        error.response?.data?.message || error.message
      );
      return [];
    }
  };



export const verifyAccount = async (data) => {
  try {
    console.log("data", data, PAYSTACK_SECRETE);
    const response = await axios.get(`${validateAccount}?account_number=${data.accountNumber}&bank_code=${data.bankCode}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRETE}`, 
      },
  });
    const accountData = response.data.data;
    console.log("Account Name:", accountData.account_name);
    console.log("Bank Name:", accountData);
    return accountData
  } catch (error) {
    console.log("Error verifying account:", error.response.data.message.split(". ")[0]);
    return error.response.data.message.split(". ")[0]
  }
};


export const createRecipient = async (accountNumber, bankCode, accountName) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRETE}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.recipient_code;
  } catch (error) {
    console.error("Error creating recipient:", error.response?.data || error.message);
    throw error;
  }
};


export const payout = async (recipientCode, amount) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100, 
        recipient: recipientCode,
        reason: "Payment for services",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRETE}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Transfer Successful:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error making transfer:", error.response?.data || error.message);
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
  const res = response(cardPayment, paymentPayload);
  return res;
};