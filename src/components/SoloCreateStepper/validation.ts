import * as Yup from "yup";
import { BASE_URL_SOLO_VERIFY_USERNAME } from "../../constants/urls";

interface IValidation {
  username: (value: string) => Promise<{ isValid: boolean; error: string }>;
  description: (value: string) => Promise<{ isValid: boolean; error: string }>;
  email: (value: string) => Promise<{ isValid: boolean; error: string }>;
  discord: (value: string) => Promise<{ isValid: boolean; error: string }>;
  twitter: (value: string) => Promise<{ isValid: boolean; error: string }>;
  instagram: (value: string) => Promise<{ isValid: boolean; error: string }>;
  website: (value: string) => Promise<{ isValid: boolean; error: string }>;
}

export default <IValidation>{
  username: (value) => {
    return new Promise(async (resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const hasValue = value.length > 0;
      const isMin = value.length >= 2;
      const isMax = value.length <= 25;
      const isAlphanumeric = /^[A-Za-z0-9_#$]+$/.test(value);

      if (!hasValue) {
        isValid = false;
        error = "Please enter a username";

        resolve({ isValid, error });
      }
      if (!isMin) {
        isValid = false;
        error += "Too Short. ";
      }
      if (!isMax) {
        isValid = false;
        error += "Too Long. ";
      }
      if (!isAlphanumeric) {
        isValid = false;
        error += "Invalid Characters. ";
      }
      if (!isMin || !isMax || !isAlphanumeric) {
        resolve({ isValid, error });
      }

      await fetch(BASE_URL_SOLO_VERIFY_USERNAME, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: value }),
      }).then((res) => {
        if (!res.ok) {
          isValid = false;
          error += "Username already exists. ";
        }
      });

      resolve({
        isValid,
        error,
      });
    });
  },
  description: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const hasValue = value.length > 0;
      const isMin = value.length >= 20;
      const isMax = value.length <= 300;

      if (!hasValue) {
        isValid = false;
        error = "Please enter a description";

        resolve({ isValid, error });
      }
      if (!isMin) {
        isValid = false;
        error += "Too Short. ";
      }
      if (!isMax) {
        isValid = false;
        error += "Too Long. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
  email: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const yupSchema = Yup.string().email("Invalid email");
      const isEmail = yupSchema.isValidSync(value);
      const hasValue = value.length > 0;

      if (!isEmail) {
        isValid = false;
        error += "Invalid email. ";
      }
      if (!hasValue) {
        isValid = false;
        error += "Please enter an email. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
  discord: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const rx: any = new RegExp("^.([A-Za-z0-9_]){1,32}#[0-9]{4}$");

      const hasValue = value.length > 0;
      const isDiscord = rx.test(value);

      if (hasValue && !isDiscord) {
        isValid = false;
        error += "Invalid Discord. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
  twitter: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const rx: any = new RegExp("^@.[a-zA-Z0-9_]{1,15}$");

      const hasValue = value.length > 0;
      const isTwitter = rx.test(value);

      if (hasValue && !isTwitter) {
        isValid = false;
        error += "Invalid Twitter. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
  instagram: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const rx: any = new RegExp(
        "@.([A-Za-z0-9._](?:(?:[A-Za-z0-9._]|(?:.(?!.))){2,28}(?:[A-Za-z0-9._]))?)$"
      );

      const hasValue = value.length > 0;
      const isInstagram = rx.test(value);

      if (hasValue && !isInstagram) {
        isValid = false;
        error += "Invalid Instagram. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
  website: (value) => {
    return new Promise((resolve, reject) => {
      let isValid: boolean = true;
      let error: string = "";

      const rx: any = new RegExp(
        "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*(),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+"
      );

      const hasValue = value.length > 0;
      const isUrl = rx.test(value);

      if (hasValue && !isUrl) {
        isValid = false;
        error += "Invalid URL. ";
      }

      resolve({
        isValid,
        error,
      });
    });
  },
};
