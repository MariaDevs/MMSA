import crypto from "crypto";

export const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID!,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY!,
  passphrase: process.env.PAYFAST_PASSPHRASE!,
  sandbox: process.env.PAYFAST_SANDBOX === "true",
};

export function getPayFastUrl() {
  return PAYFAST_CONFIG.sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

export function generateSignature(data: Record<string, string>, passphrase: string): string {
  const paramString = Object.entries(data)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  const stringWithPassphrase = passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
    : paramString;

  return crypto.createHash("md5").update(stringWithPassphrase).digest("hex");
}

export function buildPayFastData(params: {
  dealerId: string;
  packageId: string;
  packageName: string;
  amount: number;
  dealerEmail: string;
  dealerName: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}): Record<string, string> {
  const { merchantId, merchantKey, passphrase } = PAYFAST_CONFIG;

  const data: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    email_address: params.dealerEmail,
    m_payment_id: `${params.dealerId}_${params.packageId}_${Date.now()}`,
    amount: params.amount.toFixed(2),
    item_name: `MotorsMarket SA - ${params.packageName}`,
    item_description: `30-day vehicle listing package for ${params.dealerName}`,
    custom_str1: params.dealerId,
    custom_str2: params.packageId,
  };

  data.signature = generateSignature(data, passphrase);
  return data;
}

export function verifyITN(params: Record<string, string>): boolean {
  const { passphrase } = PAYFAST_CONFIG;
  const receivedSignature = params.signature;

  const dataWithoutSig = Object.fromEntries(
    Object.entries(params).filter(([k]) => k !== "signature")
  );

  const expectedSignature = generateSignature(dataWithoutSig, passphrase);
  return receivedSignature === expectedSignature;
}
