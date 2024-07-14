import axios from "axios";


export async function getToken(username: string) {
    const token = await axios.post(process.env.BACKEND_URL, {
        username
    })
    return token
}