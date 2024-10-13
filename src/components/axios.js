import axios from "axios";


async function createPayment(total) {
  try {
    const response = await axios.post("http://localhost:8304/clone-99b88/us-central1/payments/create", {
      total: total
    });

    return response.data; 
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export default createPayment;
