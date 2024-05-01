import {isEdgeLight, isNetlify, isWorkerd} from "std-env";

function checkVercel() {
    return !!(process.env.VERCEL || process.env.NOW_REGION);
}

const isVercel = checkVercel();
export const isServerless = isEdgeLight || isVercel || isNetlify || isWorkerd;