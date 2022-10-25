import { Escrow } from "../types";

const escrow: Escrow = {
  global: {
    mainnet: {
      escrowProgram: "A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
    },
    devnet: {
      escrowProgram: "Hy2ozEhB5xAB8u4XHQhHiy4AEqXnuWcyML9oTPkdxdpf",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
    },
  },
  SolBear: {
    mainnet: {
      escrowProgram: "3HiXNtAFFoSTtkP52EoFbf8r3aobaeLhMbeGdEWEh8V3",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "CJVFTuvkdwjvkKtDSrBhhwxZHfYQLra4A7CKqbehMWrg",
      royalties: "0.1",
    },
    devnet: {
      escrowProgram: "3HiXNtAFFoSTtkP52EoFbf8r3aobaeLhMbeGdEWEh8V3",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "CJVFTuvkdwjvkKtDSrBhhwxZHfYQLra4A7CKqbehMWrg",
      royalties: "0.1",
    },
  },
  ['The Sneks']: {
    mainnet: {
      escrowProgram: "5syLbMQAW5CCkukiR1DZ9o2Q6wZJYihfWTzLu1FvJWAq",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "E1bZ99d56AK9vCFq9Y5nC7ZVz2z8CcxVECsDTyZVksmS",
      royalties: "0.03",
    },
    devnet: {
      escrowProgram: "5syLbMQAW5CCkukiR1DZ9o2Q6wZJYihfWTzLu1FvJWAq",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "E1bZ99d56AK9vCFq9Y5nC7ZVz2z8CcxVECsDTyZVksmS",
      royalties: "0.03",
    },
  },
  ['Crypto Idolz']: {
    mainnet: {
      escrowProgram: "5kTrEpSpmWWrerrxs45xbjL6zrhwmw2QG8MrH4eQ79HZ",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "AELVv6dYPnkvLUx5jANRoRhxWKSQDyPQ5fkMHVXCvht2",
      royalties: "0.069",
    },
    devnet: {
      escrowProgram: "5kTrEpSpmWWrerrxs45xbjL6zrhwmw2QG8MrH4eQ79HZ",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "AELVv6dYPnkvLUx5jANRoRhxWKSQDyPQ5fkMHVXCvht2",
      royalties: "0.069",
    },
  }
};

export default escrow;
