import {User} from "@global/types.ts";
import {defaultUser} from "@global/default.ts";

const setTokenInCookies = (token: string): void => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Set cookie expiry time (1 hour)
    document.cookie = `authToken=${encodeURIComponent(token)}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax; Secure`;
};

const getTokenFromCookies = (): string | null => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === 'authToken') {
            return decodeURIComponent(value);
        }
    }
    return null; // Return null if not found
};

const deleteTokenFromCookies = (): void => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";
};

const fetchUserFromToken = async (
    token: string,
    baseUrl: string,
    setUser: (user: any) => void
): Promise<boolean> => {
    try {
        const response = await fetch(`${baseUrl}/api/verify/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            if (user && typeof user.id === 'string' && typeof user.email === 'string' && typeof user.phone === 'string') {
                setUser(new User(user.id, user.user_metadata.display_name, user.email, user.phone, user.user_metadata.account_type));
                console.log(user);
                return true;
            } else {
                console.error('Invalid user data');
                return false;
            }

        } else {
            console.error('Failed to fetch user data');
            setUser(defaultUser);
            return false;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(defaultUser);
        return false;
    }
};

export { setTokenInCookies, getTokenFromCookies, deleteTokenFromCookies, fetchUserFromToken };
