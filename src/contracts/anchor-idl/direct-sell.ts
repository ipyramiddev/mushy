export const idl = {
  version: "0.0.0",
  name: "direct_sell",
  instructions: [
    {
      name: "sell",
      accounts: [
        {
          name: "seller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "saleInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "transferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
        {
          name: "bump",
          type: "u8",
        },
        {
          name: "bumpAuthority",
          type: "u8",
        },
      ],
    },
    {
      name: "lowerPrice",
      accounts: [
        {
          name: "seller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "saleInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
      ],
    },
    {
      name: "cancel",
      accounts: [
        {
          name: "seller",
          isMut: true,
          isSigner: true,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "saleInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "transferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bumpAuthority",
          type: "u8",
        },
      ],
    },
    {
      name: "buy",
      accounts: [
        {
          name: "buyer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "buyerToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "seller",
          isMut: true,
          isSigner: false,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "saleInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "transferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "salesTaxRecipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
        {
          name: "bumpAuthority",
          type: "u8",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "SaleInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "initializerPubkey",
            type: "publicKey",
          },
          {
            name: "mintPubkey",
            type: "publicKey",
          },
          {
            name: "expectedAmount",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 300,
      name: "PublicKeyMismatch",
      msg: "Public key mismatch",
    },
    {
      code: 301,
      name: "HigherPrice",
      msg: "Cannot increase price",
    },
    {
      code: 302,
      name: "PriceMismatch",
      msg: "Price mismatched",
    },
    {
      code: 303,
      name: "MetadataMismatch",
      msg: "Metadata mismatched",
    },
  ],
};
