import { Link, useParams } from "react-router";

import negative_icon from "@/assets/negative.png";
import neutral_icon from "@/assets/neutral.png";
import positive_icon from "@/assets/positive.png";
import review_icon from "@/assets/reviewbutton.png";
import Header from "@/components/layout/Header";
import { useDealer, useDealerReviews } from "@/hooks/useDealers";

import "./Dealers.css";

const Dealer = () => {
  const { id } = useParams();
  const { data: dealer, isLoading: dealerLoading, isError: dealerError } = useDealer(id);
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useDealerReviews(id);

  const sentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral') => {
    if (sentiment === "positive") {
      return positive_icon;
    }

    if (sentiment === "negative") {
      return negative_icon;
    }

    return neutral_icon;
  };

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      {dealerLoading ? <div style={{ marginTop: "10px" }}>Loading dealer...</div> : null}
      {dealerError ? <div style={{ marginTop: "10px" }}>Unable to load dealer.</div> : null}

      {dealer ? (
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ color: "grey" }}>
            {dealer.full_name}
            {sessionStorage.getItem("username") ? (
              <Link to={`/postreview/${dealer.id}`}>
                <img
                  src={review_icon}
                  style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
                  alt="Post Review"
                />
              </Link>
            ) : null}
          </h1>
          <h4 style={{ color: "grey" }}>
            {dealer.city},{dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
        </div>
      ) : null}

      <div className="reviews_panel">
        {reviewsLoading ? <span>Loading Reviews....</span> : null}
        {reviewsError ? <div>Unable to load reviews.</div> : null}
        {!reviewsLoading && !reviewsError && reviews.length === 0 ? <div>No reviews yet!</div> : null}
        {!reviewsLoading && !reviewsError
          ? reviews.map((review, index) => (
              <div key={`${review.name}-${index}`} className="review_panel">
                <img
                  src={sentimentIcon(review.sentiment)}
                  className="emotion_icon"
                  alt="Sentiment"
                />
                <div className="review">{review.review}</div>
                <div className="reviewer">
                  {review.name} {review.car_make} {review.car_model} {review.car_year}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Dealer;
