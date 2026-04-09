"use client";
import { Turnstile } from "@marsidev/react-turnstile";

const Captcha = ({ onVerify }) => {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      onSuccess={onVerify}
      style={{ width: "100%" }}
      options={{
        size: "flexible", 
      }}
    />
  );
};

export default Captcha;
