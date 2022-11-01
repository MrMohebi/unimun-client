export const phoneNumberValidation = (phone: string) => {
    if (phone[0] === '0' && phone[1] === '9') {
        if (phone.length === 11) {
            return true;
        }
    }
    return false;
}