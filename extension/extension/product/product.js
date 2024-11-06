const form = document.getElementById('productForm');
const submitButton = document.getElementById('submitButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

function showAlert(element, message) {
    element.style.display = 'block';
    element.textContent = message;
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
    submitButton.textContent = isLoading ? 'Adding Product...' : 'Add Product';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    setLoading(true);

    const formData = {
        company: {
            name: document.getElementById('companyName').value
        },
        product: {
            name: document.getElementById('productName').value,
            product_overview: document.getElementById('productOverview').value,
            product_description: document.getElementById('productDescription').value
        }
    };

    try {
        const response = await fetch('/api/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(successAlert, 'Product added successfully!');
            form.reset();
        } else {
            throw new Error(data.message || 'Failed to add product');
        }
    } catch (error) {
        showAlert(errorAlert, error.message);
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
});