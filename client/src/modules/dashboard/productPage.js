import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { loadIntoDatabase, fetchSentiment } from '../../service';
import axios from 'axios';

function ProductPage() {

    const[productTitle, setProductTitle] = useState("");
    const[thumbnail, setThumbnail] = useState("");
    const[price,setPrice] = useState("");
    const[reviews,setReviews] = useState("");
    const[stars_stat,setStartStat] = useState("");
    const[rating,setRating] = useState("");
    const[reviewCount,setReviewCount] = useState("");
    const[asin,setAsin] = useState("");
    const[userID,setUserID] = useState("");
    const[overallSentiment, setOverallSentiment] = useState("");
    const reviewAccessData = {};
    const location = useLocation();
    
    

    useEffect(() => {
        if (location.data) {
            setUserID(location.data.userID);
            setAsin(location.data.asin);
            setProductTitle(location.data.title);
            reviewAccessData["userID"] = userID;
            reviewAccessData["asin"] = asin;
        }  
    });

    const reviewAnalysis = async () => {
        console.log(reviewAccessData);
        axios.post('https://7jjweip03i.execute-api.us-east-1.amazonaws.com/default/reviewanalysis',reviewAccessData).then((result) => {
        console.log(result.data.body);
        demoFunc(result.data.body);
        }).catch((err) => {
            console.log(err);
        }) 
    }

    async function demoFunc(reviewData) {
        const response = await loadIntoDatabase(reviewData);
        console.log(response.data);
        const sentimentData = await fetchSentiment(response.data);
        setOverallSentiment('Sentiment of this product from review is '+sentimentData.data.Items[0].overallSentiment);
    } 

    return (
        <div>
            <div className="container">
                <h2> {productTitle} </h2>
            </div>
            <button onClick={reviewAnalysis}>Review Analysis</button>
            <h4>{overallSentiment}</h4>
            <button>Rating visulization</button>
        </div>
    );

}

export default ProductPage;