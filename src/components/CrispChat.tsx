"use client"
import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("87d708ed-d9e7-4161-8df6-cba7ee9ead9e");
    });
    return null;
}

export default CrispChat;