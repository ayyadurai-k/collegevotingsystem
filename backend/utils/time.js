export const getExpiryTime = () => {
    const date = new Date()
    date.setTime(date.getTime() + 5*60*1000);
    return date
}