export const generateUsername = (email, username) => {
  if (username?.trim()) return username.trim();

  const base = email.split("@")[0].slice(0, 16); // 16 chars + 4 digits
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const finalUsername =  `${base}${randomNum}`;
  return finalUsername
};
