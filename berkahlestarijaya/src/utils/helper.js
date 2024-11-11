import axios from "axios"
import Cookies from "js-cookie"
export const getItem = (key) => {
  const item = Cookies.get(key)
  if (typeof item === "undefined") {
    return null
  }
  try {
    return JSON.parse(item)
  } catch (error) {
    if (typeof item === "undefined") {
      return null
    }

    return item
  }
}

export const setItem = (key, value) => {
  return Cookies.set(key, value)
}

export const removeItem = (key) => {
  return Cookies.remove(key)
}

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
}

export const createLog = (body) => {
  axios
    .post("https://prodmainet.berkahlestarijaya.com/api/log/create", body)
    .then((res) => {
      console.log("ok")
    })
}

export const onReadyForServerApproval = (paymentId) => {
  console.log("onReadyForServerApproval", paymentId)
  createLog({
    value: "onReadyForServerApproval",
    body: JSON.stringify({ paymentId }),
  })
  axios
    .post(
      "https://prodmainet.berkahlestarijaya.com/api/payments/approve",
      { paymentId },
      config
    )
    .catch((err) => alert(JSON.stringify(err.response)))
}

export const onReadyForServerCompletion = (paymentId, txid) => {
  console.log("onReadyForServerCompletion", paymentId, txid)
  createLog({
    value: "onReadyForServerCompletion",
    body: JSON.stringify({ paymentId, txid }),
  })
  // axiosClient.post('/payments/complete', {paymentId, txid}, config);
  axios.post(
    "https://prodmainet.berkahlestarijaya.com/api/payments/complete",
    { paymentId, txid },
    config
  )
}

export const onCancel = (paymentId) => {
  console.log("onCancel", paymentId)
  createLog({
    value: "onCancel",
    body: JSON.stringify({ paymentId }),
  })
  axios.post(
    "https://prodmainet.berkahlestarijaya.com/api/payments/cancel",
    { paymentId },
    config
  )
}

export const onError = (error, payment = null) => {
  console.log("onError", error)
  if (payment) {
    console.log(payment)
    createLog({
      value: "onError",
      body: JSON.stringify(payment),
    })
    // handle the error accordingly
  }
}

export const onIncompletePaymentFound = (payment) => {
  createLog({
    value: "onIncompletePaymentFound",
    body: JSON.stringify(payment),
  })
  // return axiosClient.post('/payments/incomplete', {payment});
}

export function maskString(str) {
  if (!str) {
    return ""
  }

  if (str.length < 4) {
    return str
  }

  return str.substring(0, 4) + "..." + str.substring(str.length - 4)
}
