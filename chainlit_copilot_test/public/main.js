//const BASE_URL = "https://hotel-rovereto-r7blt2y3oa-ew.a.run.app";
// const BASE_URL = "https://hotel-rovereto-experimental-r7blt2y3oa-ew.a.run.app/"
const BASE_URL = "https://hotel-rovereto-r7blt2y3oa-nw.a.run.app/"
//const BASE_URL = "http://localhost:8000";

async function fetchAccessToken() {
    // Check if the token already exists and is not expired
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
        const tokenPayload = JSON.parse(atob(storedToken.split(".")[1]));
        if (tokenPayload.exp * 1000 > Date.now()) {
            return storedToken; // Token is still valid
        }
    }

    // Fetch a new token if none exists or it has expired
    const response = await fetch(
        "https://authenticator-r7blt2y3oa-nw.a.run.app/token",
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

fetchAccessToken()
    .then((accessToken) => {
        const script = document.createElement("script");
        script.src = `${BASE_URL}copilot/index.js`;
        script.onload = () => {
            window.mountChainlitWidget({
                chainlitServer: BASE_URL + "/",
                accessToken: accessToken, // Pass the token here
                theme: "light", // other configurations
            });
        };
        document.head.appendChild(script);
    })
    .catch((error) => {
        console.error("Error initializing the Copilot widget:", error);
    });
