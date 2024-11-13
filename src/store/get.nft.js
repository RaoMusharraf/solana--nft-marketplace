export const getnft = async (mintHash) => {
    try {
        const response = await (await fetch(`http://localhost:5000/api/nft/getNftsByWallet/${mintHash}`)).json();
        return response.body;
    } catch (error) {
        console.error('Error fetching digital asset by mintHash:', error);
        throw error;
    }
};