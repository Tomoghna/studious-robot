import md5 from "md5";

export const getAvatarFromEmail = (email) => {
    if (!email) return "";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};