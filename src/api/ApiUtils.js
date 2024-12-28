import React, { useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001'

const apiClient = axios.create({
    baseURL: SERVER_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
      }
});

export const ApiUtils = {
    get: (endpoint, params) => {
        return handleRequest(() => apiClient.get(endpoint, { params })).then(result => result);
    },
    post: (endpoint, data) => {
        return handleRequest(() => apiClient.post(endpoint, data)).then(result => {
            console.log("resultPOST", result);
            return result;
        });
    },
    put: (endpoint, data) => {
        return handleRequest(() => apiClient.put(endpoint, data)).then(result => {
            console.log("resultPUT", result);
            return result;
        });
    },
    delete: (endpoint, data) => {
        return handleRequest(() => apiClient.delete(endpoint, data)).then(result => {
            console.log("resultDELETE", result);
            return result;
        });
    }
};


async function handleRequest(requestFunction) {

    try {
        const response = await requestFunction();
        
        const data = response.data;
        
        if (data.Success) {

            return {
                success: true,
                data: response.data,
                role: response.data.role,
                message: response.data.message
            }
        }
        else {
            return {
                success: false,
                status: response.status,
                error: response.data,
            }
        }
    }
    catch (error) {        
        return {
            success: false,
            error: error.response.data.message,
            status: error?.status,
        }
    }
}