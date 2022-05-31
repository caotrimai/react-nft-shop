import dayjs from 'dayjs'

export const shorthandAddress = (address) => address ? `${address.slice(0, 5)}...${address.slice(-4)}` : ''

export const convertToLocalDate = (milliseconds) => dayjs.unix(milliseconds).format('DD/MM/YYYY HH:mm:ss')