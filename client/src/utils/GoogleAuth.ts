export const handleGoogleLogin = async () => {
    try {  
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        // const redirectUri = "https://accounts.google.com/o/oauth2/v2/auth";
        const redirectUri = `${window.location.origin}/auth/callback`;
        const scope = "openid profile email";
        const responseType = "id_token";
        const nonce = Math.random().toString(36).substring(2); // Simple random nonce
    
        // const url = `${redirectUri}?client_id=${clientId}&redirect_uri=${window.location.origin}/auth/callback&response_type=${responseType}&scope=${scope}`; 
        // const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&nonce=${nonce}`;
        window.location.href = url;
    } catch (error) {
        console.error("Google Auth Error:", error);
        throw error;
    }
};