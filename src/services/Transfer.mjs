/**
 * Checks if the card is valid and has sufficient balance before transferring money.
 * @param {Card} card - The card object.
 * @param {number} amount - The amount to transfer.
 * @returns {boolean} - Returns true if the transfer is successful, false otherwise.
 */


export function CheckCardAndTransferMoney(card, amount) {
    if (card == null) {
        return false;
    }

    if (!card.isValid()) {
        return false;
    }

    if (!card.hasSufficientBalance(amount)) {
        return false;
    }

    if (!card.cvc || card.cvc.length !== 3) {
        return false;
    }

    const currentDate = new Date();
    const cardExpiryDate = new Date(card.expiryYear, card.expiryMonth - 1); 
    if (cardExpiryDate < currentDate) {
        return false;
    }

    return true;
}
