export const getExpiryTime = () => {
    const date = new Date()
    date.setTime(date.getTime() + 2*60*1000);
    return date
}