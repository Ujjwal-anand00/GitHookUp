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
    "location",
    "profilePicture",
    "age",
    "gender",
    "skills",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData
};
