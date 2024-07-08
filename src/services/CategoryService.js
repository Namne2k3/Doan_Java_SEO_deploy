import axios from "axios";

const BASE_URL = "http://localhost:8080"

const fetchALlCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/categories`);
        if (response.data) {
            // console.log("Check data all categories >>> ", response.data.dataList);
            return response.data.dataList;
        }
        throw new Error("Can't fetch categories data")

    } catch (err) {
        console.error("Error get categories data:", err);
    }
}

export {
    fetchALlCategories
}