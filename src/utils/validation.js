const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || firstName.length < 3) {
    throw new Error("Name is not valid !!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email id is not valid !!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password!!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedEditFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `You are not allowed to edit these fields: ${invalidFields.join(", ")}`
    );
  }

  return true;
};


module.exports = {
  validateSignUpData,
  validateEditProfileData
};
