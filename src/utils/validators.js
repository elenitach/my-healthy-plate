export const passwordIsValid = (password) => {
  return password.length > 6;
};

export const weightIsValid = (weight) => {
  return weight >= 1 && weight <= 300;
};

export const heightIsValid = (height) => {
  return height >= 1 && height <= 300;
};

export const birthDateIsValid = (birthdate) => {
  return (
    birthdate >= "1900-01-01" &&
    birthdate <=
      `${new Date().getFullYear() - 1}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`
  );
};

export const INVALID_PASSWORD_ERROR_MESSAGE =
  "The password must be at least 8 characters in length";
export const INVALID_WEIGHT_ERROR_MESSAGE = "The value must be between 1 and 300";
export const INVALID_HEIGHT_ERROR_MESSAGE = "The value must be between 1 and 300";
export const INVALID_BIRTHDATE_ERROR_MESSAGE = "Incorrect birth date";
export const INVALID_BMR_ERROR_MESSAGE = "Check if all the fields are correct";
export const PASSWORDS_DO_NOT_MATCH_ERROR_MESSAGE =
  "The passwords do not match";
export const EXISTING_EMAIL_ERROR_MESSAGE = 'This email is already in use';
