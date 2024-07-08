import axios from "axios";
const sendEmailVerify = async (email) => {
    const formData = new FormData();
    formData.append('email', email);
    const res = await axios.post(`http://localhost:8080/api/v1/emails/verify`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return res;
}

export {
    sendEmailVerify
}