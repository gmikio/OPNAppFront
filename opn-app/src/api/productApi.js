export const checkProduct = async (barcode) => {
    try {
        const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/product/Check?code=${barcode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Response:', response)
        return response;
    } catch (error) {
        console.error('Error checking product:', error);
        throw error;
    }
};

export const addProduct = async (productDetails) => {
    try {
        const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/product/Add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDetails),
        });
        return response;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const editProduct = async (productDetails) => {
    try {
        const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/product/Edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDetails),
        });
        return response;
    } catch (error) {
        console.error('Error editing product:', error);
        throw error;
    }
};

export const registerProduct = async (productDetails) => {
    try {
        const response = await fetch(`http://opn-contabilizacao-env.eba-wnru99in.us-east-1.elasticbeanstalk.com/api/product/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDetails),
        });
        return response;
    } catch (error) {
        console.error('Error registering product:', error);
        throw error;
    }
};
