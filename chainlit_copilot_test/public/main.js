//const BASE_URL = "https://hotel-rovereto-r7blt2y3oa-ew.a.run.app";
// const BASE_URL = "https://hotel-rovereto-experimental-r7blt2y3oa-ew.a.run.app/"
//const BASE_URL = "https://hotel-rovereto-r7blt2y3oa-nw.a.run.app/"
const AUTH_URL = "https://authenticator-r7blt2y3oa-nw.a.run.app/token"
const BASE_URL = "http://localhost:8000/";
async function fetchAccessToken() {
    // Check if the token already exists and is not expired
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
        const tokenPayload = JSON.parse(atob(storedToken.split(".")[1]));
        if (tokenPayload.exp * 1000 > Date.now()) {
            return storedToken; // Token is still valid
        }
    }
    const response = await fetch(
        AUTH_URL,
        {
            method: "GET",
            headers: {
                // Include any necessary headers here
            },
        },
    );

    if (!response.ok) {
        throw new Error("Failed to fetch the access token");
    }

    const data = await response.json();
    const token = data.token;
    if (token !== undefined) {
        localStorage.setItem("accessToken", token); // Store the new token
    }
    return token;
}
let accessToken = null
try {
    accessToken = await fetchAccessToken()
}
catch {
    console.error("Error initializing the Copilot widget:", error);
}
console.assert(BASE_URL.at(-1) == "/", "BASE_URL must end with a slash")
console.log('Got access token!')
const script = document.createElement("script");
script.src = `${BASE_URL}copilot/index.js`;
script.onload = () => {
    window.mountChainlitWidget({
        chainlitServer: BASE_URL + "/",
        accessToken: accessToken, // Pass the token here
        theme: "light", // other configurations
    });
    console.log('Mounted.')
};
document.head.appendChild(script);
