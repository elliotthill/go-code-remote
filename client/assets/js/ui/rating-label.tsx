import React from "react";


export default function RatingLabel({rating}){


    if (rating < 3.8) {
        return(
            <span className="font-semibold float-right text-gray-600">{rating}</span>
        )
    } else if (rating > 3.8 && rating < 4.1) {
        return(
            <span className="font-semibold float-right text-emerald-700">{rating}</span>
        )
    } else if (rating >= 4.1) {
        return(
            <span className="font-semibold float-right text-emerald-400">{rating}</span>
        )
    }

}