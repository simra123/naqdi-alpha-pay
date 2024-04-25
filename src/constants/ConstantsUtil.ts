"use client";

const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"];
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

export const ConstantsUtil = {
  SigningSucceededToastTitle: "Signing Succeeded",
  SigningFailedToastTitle: "Signing Failed",
  TestIdSiweAuthenticationStatus: "w3m-authentication-status",
  Metadata: {
    name: "ALPHAS",
    description: "ALPHASPAY",
    url: "http:localhost:3000",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  ProjectId: projectId,
};
