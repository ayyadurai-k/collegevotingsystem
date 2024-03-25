import axios from 'axios'

export const listPolls = async () => {
    return await axios.post("/api/v1/vote/poll/fetch")
}

export const createPoll = async (data) => {
    return await axios.post("/api/v1/vote/poll/create", data)
}

export const deletePoll = async (data) => {
    return await axios.delete("/api/v1/vote/poll/delete", data)
}

export const requestOTP = async (regno) => {
    return await axios.post(`/api/v1/vote/poll/vote/${regno}`)
}

export const enterOTP = async (data) => {
    return await axios.post(`/api/v1/vote/poll/enter-otp`,data)
}

export const getResult = async () => {
    return await axios.get(`/api/v1/vote/poll/result`)
}


