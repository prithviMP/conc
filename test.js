var options = {
    "key": "rzp_test_0eGcmNDRrunO2e", // Enter the Key ID generated from the Dashboard
    "amount": "499", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp", //your business name
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": "order_NusVFoHoF0und8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "https://krupalini-swamy.webflow.io/",
    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};