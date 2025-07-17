import { createUser, findUserByEmail } from "../services/auth.service.js";
import createError from "../utils/createError.js";
import { generateUsername } from "../utils/generateUsername.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";


export async function register(req, res, next) {
  try {
    const { email, password, username } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      createError(409, "This email has already been used by other user.");
    }

    const finalUsername = generateUsername(email, username);

    const newUser = await createUser({
      email,
      password,
      username: finalUsername,
    });

    res.status(201).json({
      message: `Register Success, Welcome User ≪ ${newUser.username}≫ to myFlashcard `,
      body: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      createError(401, "Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError(401, "Invalid email or password");
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = signToken(payload);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    next(error)
  }
}

// Logout controller: client should delete JWT token on logout
export async function logout(req, res, next) {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
}

