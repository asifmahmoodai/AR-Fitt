import base64
import os
import openai
from flask import Flask, request, jsonify

app = Flask(__name__)

client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Read & encode CSV at startup (so we do it only once)
with open('D:\\laragon\\www\\arfit\\products_arfit.csv', 'rb') as csv_file:
    csv_data = csv_file.read()
encoded_csv = base64.b64encode(csv_data).decode('utf-8')

@app.route('/recommend', methods=['POST'])
def recommend():
    """
    This endpoint expects:
      1) A JSON payload containing an 'image' key whose value is a Base64-encoded image string.
      2) Optionally any other user data.
    Returns a JSON response containing AI recommendations.
    """
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided in JSON.'}), 400

    base64_image = data['image']
    # If the Base64 string includes a data URL prefix, remove it.
    if base64_image.startswith("data:image"):
        base64_image = base64_image.split(",", 1)[1]

    try:
        # Decode the Base64 string to ensure it is valid.
        image_bytes = base64.b64decode(base64_image)
    except Exception as e:
        return jsonify({"error": "Invalid Base64 image."}), 400

    # (Optional) Re-encode the bytes so we can construct a data URL.
    encoded_image = base64.b64encode(image_bytes).decode('utf-8')
    image_data_url = f"data:image/png;base64,{encoded_image}"

    # Original prompt text
    # prompt_text = (
    #     "You will be given an image of a person and a CSV file (base64-encoded) with ecommerce product data. "
    #     "Your task is to do the following:\n\n"
    #     "1) Analyze the image and determine the person's clothing size (e.g., S, M, L, XL, etc.) and skin tone.\n"
    #     "2) Recommend the best shirt colors for this person.\n"
    #     "3) Decode the provided CSV data (which contains product details such as ID, product_name, color, available_sizes, etc.) "
    #     "and identify the products (by ID and product_name) that match the person's size and recommended shirt colors.\n\n"
    #     "Do not include any additional explanations or commentary. "
    #     "Output your final answer exactly in the following format (each line must be on a new line with no extra text):\n\n"
    #     "Size = <recommended size>\n"
    #     "Skin tone = <determined skin tone>\n"
    #     "Recommended shirt colors = <comma-separated list of colors>\n"
    #     "Recommended shirts = <comma-separated list of product IDs>\n\n"
    #     "CSV Data (base64-encoded):\n" + encoded_csv
    # )

    #Modified prompt text
    prompt_text = (
        "You will be given an image of a person and a CSV file (base64-encoded) with ecommerce product data. "
        "Your task is to do the following:\n\n"
        "1) Analyze the image and determine the person's clothing size (e.g., S, M, L, XL, etc.) and skin tone.\n"
        "2) Recommend the best shirt colors for this person.\n"
        "3) Decode the provided CSV data (which contains product details such as ID, product_name, color, available_sizes, etc.) "
        "and identify the products (by ID and product_name, available_sizes) that match the person's recommended size .\n\n"
        "4) Do not include any additional explanations or commentary.\n\n"
        # "5)Always include all product IDs from the CSV in the final recommendation, ordered from most relevant to least relevant. \n\n"
        "5) Output your final answer exactly in the following format (each line must be on a new line with no extra text):\n\n"
        "Size = <recommended size>\n"
        "Skin tone = <determined skin tone>\n"
        "Recommended shirt colors = <comma-separated list of colors>\n"
        "Recommended shirts = <comma-separated list of product IDs>\n\n"
        "CSV Data (base64-encoded):\n" + encoded_csv
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",  # or any available ChatCompletion model
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {"type": "image_url", "image_url": {"url": image_data_url}},
                    {"type": "text", "text": "CSV Data (base64-encoded): " + encoded_csv}
                ],
            }]
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        model_reply = response.choices[0].message.content
        return jsonify({"recommendations": model_reply}), 200
    except (IndexError, KeyError):
        return jsonify({"error": "No valid response from the model."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
