import axios from "axios";
import fs from "fs";

const testUpload = async () => {
	try {
		const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // 1x1 red dot
		
		const response = await axios.post("http://localhost:5000/api/products", {
			name: "Test Upload API",
			description: "Testing local image upload via script",
			price: 1.99,
			image: base64Image,
			category: "glasses"
		}, {
			headers: {
				"Cookie": "accessToken=REPLACE_WITH_VALID_TOKEN" // I need a token!
			}
		});

		console.log("Upload response:", response.data);
	} catch (error) {
		console.error("Upload failed:", error.response?.data || error.message);
	}
};

// I need to find a way to get an admin token or just run the logic directly.
// Since I can run node scripts, I'll just import the logic if possible or just use the subagent to login and then I'll use its token.
