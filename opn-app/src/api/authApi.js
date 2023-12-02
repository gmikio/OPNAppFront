const loginUser = async (idn, name) => {
    try {
        const response = await fetch(`http://opn-contabilizacao.us-east-1.elasticbeanstalk.com/api/User/Login/?idn=${idn}&name=${name}`);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error('Error during login request:', error);
        throw error;
    }
};

export { loginUser };