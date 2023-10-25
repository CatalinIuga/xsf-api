export const idCheck = (id: string) => {
  switch (true) {
    case isNaN(Number(id)) || !id:
      return "Invalid user id.";
    default:
      return "";
  }
};

const usernameCheck = (username: string) => {
  switch (true) {
    case username === "" || username === undefined:
      return "Username cannot be empty";
    case !/^[a-zA-Z0-9_]+$/.test(username):
      return "Username can only contain letters, numbers and underscores";
    case username.length < 4:
      return "Username must be at least 4 characters";
    case username.length > 32:
      return "Username must be less than 32 characters";
    default:
      return "";
  }
};

export const emailCheck = (email: string) => {
  const emailRegex = /\S+@\S+\.\S+/;
  switch (true) {
    case email === "" || email === undefined:
      return "Email cannot be empty";
    case email.length < 5:
      return "Email must be at least 8 characters";
    case email.length > 32:
      return "Email must be less than 32 characters";
    case !emailRegex.test(email):
      return "Invalid email";
    default:
      return "";
  }
};

export const passwordCheck = (password: string) => {
  switch (true) {
    case password === "" || password === undefined:
      return "Password cannot be empty";
    case password.length < 8:
      return "Password must be at least 8 characters";
    case password.length > 32:
      return "Password must be less than 32 characters";
    case password.search(/\d/) === -1:
      return "Password must contain at least one digit";
    case password.search(/[a-z]/) === -1:
      return "Password must contain at least one lowercase letter";
    case password.search(/[A-Z]/) === -1:
      return "Password must contain at least one uppercase letter";
    case password.search(/[^a-zA-Z0-9]/) === -1:
      return "Password must contain at least one special character";
    default:
      return "";
  }
};

const validateUser = (username: string, email: string, password?: string) => {
  const usernameError = usernameCheck(username);
  if (usernameError) {
    return usernameError;
  }

  if (password) {
    const passwordError = passwordCheck(password);
    if (passwordError) {
      return passwordError;
    }
  }

  const emailError = emailCheck(email);
  if (emailError) {
    return emailError;
  }

  return "";
};

export default validateUser;
