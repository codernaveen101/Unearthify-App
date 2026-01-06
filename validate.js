export async function validateTurnstile(token, remoteip) {
    const CLOUDFLARE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;


    const params = new URLSearchParams();
    params.append('secret', CLOUDFLARE_SECRET_KEY);
    params.append('response', token);
    params.append('remoteip', remoteip);

    try {
        const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: params
        });

        const result = await resp.json();
        return result;
    } catch (error) {
        console.error('Turnstile validation error:', error);
        return { success: false, 'error-codes': ['internal-error'] };
    }
}