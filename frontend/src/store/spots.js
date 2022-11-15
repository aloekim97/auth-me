import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_DETAIL = 'spots/GET_DETAIL';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT'

const getSpots = (payload) => {
    return {
        type: GET_SPOTS,
        payload
    }
}

const getDetail = (payload) => {
    return {
        type: GET_DETAIL,
        payload
    }
}

const createSpot = (payload) => {
    return {
        type: CREATE_SPOT,
        payload
    }
}

const editSpot = (payload) => {
    return {
        type: EDIT_SPOT,
        payload
    }
}

export const spotsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/spots`, {
        method: "GET"
    })

    if(res.ok) {
        const data = await res.json()
        dispatch(getSpots(data))
        return data
    } else {
        throw res
    }
}

export const detailThunk = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`, {
        method: "GET"
    })

    if(res.ok) {
        const data = await res.json()
        dispatch(getDetail(data))
        return data
    } else {
        throw res
    }
}

export const createThunk = (spot) => async (dispatch) => {
    const res = await fetch(`/api/spots/`, {
        method: "POST",
        headers: {"Contenet-Type": "application/json"},
        body: JSON.stringify(spot)
    })

    if(res.ok) {
        const data = await res.json()
        dispatch(createSpot(data))
        return data
    } else {
        throw res
    }
}

export const editThunk = (spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        headers: {"Contenet-Type": "application/json"},
        body: JSON.stringify(spot)
    })

    if (res.ok) {
        const data = await Response.json()
        dispatch(editSpot(data))
        return data
    } else {
        throw res
    }
}