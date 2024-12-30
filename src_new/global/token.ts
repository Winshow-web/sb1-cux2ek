const setTokenInCookies = (token: string): void => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Set cookie expiry time (1 hour)
    document.cookie = `authToken=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`; // Secure; HttpOnly;
};

const getTokenFromCookies = (): string | null => {
    const match = document.cookie.match(/(^| )authToken=([^;]+)/);
    return match ? match[2] : null;  // Return the token or null if not found
};

const deleteTokenFromCookies = (): void => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export { setTokenInCookies, getTokenFromCookies, deleteTokenFromCookies};