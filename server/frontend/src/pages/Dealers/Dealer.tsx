import { Link, useParams } from "react-router";

import negative_icon from "@/assets/negative.png";
import neutral_icon from "@/assets/neutral.png";
import positive_icon from "@/assets/positive.png";
import review_icon from "@/assets/reviewbutton.png";
import { useDealer, useDealerReviews } from "@/hooks/useDealers";

import "./Dealers.css";
import Header from "@/components/layout/Header";

const Dealer = () => {
  const { id } = useParams();
  const {
    data: dealer,
    isLoading: dealerLoading,
    isError: dealerError,
  } = useDealer(id);
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useDealerReviews(id);

  const sentimentIcon = (sentiment: "positive" | "negative" | "neutral") => {
    if (sentiment === "positive") {
      return positive_icon;
    }

    if (sentiment === "negative") {
      return negative_icon;
    }

    return neutral_icon;
  };

  return (
    <div className="dealers-page">
      <Header />
      {dealerLoading ? (
        <div className="dealer-loading">Loading dealer...</div>
      ) : null}
      {dealerError ? (
        <div className="dealer-error">Unable to load dealer.</div>
      ) : null}

      {dealer ? (
        <div className="dealer-page">
          <div className="dealer-card">
            <div className="dealer-card-header">
              <h1 className="dealer-card-title">{dealer.full_name}</h1>
              <Link to={`/postreview/${dealer.id}`} className="review-link">
                <img
                  src={review_icon}
                  alt="Post Review"
                  className="review_icon"
                />
              </Link>
            </div>

            <ul className="dealer-meta">
              <li className="dealer-meta-item">
                <span className="dealer-meta-label">City</span>
                <span className="dealer-meta-value">{dealer.city}</span>
              </li>
              <li className="dealer-meta-item">
                <span className="dealer-meta-label">Address</span>
                <span className="dealer-meta-value">{dealer.address}</span>
              </li>
              <li className="dealer-meta-item">
                <span className="dealer-meta-label">Zip</span>
                <span className="dealer-meta-value">{dealer.zip}</span>
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      <div className="review-list">
        {reviewsLoading ? (
          <span className="review-loading">Loading reviews...</span>
        ) : null}
        {reviewsError ? (
          <div className="review-error">Unable to load reviews.</div>
        ) : null}
        {!reviewsLoading && !reviewsError && reviews.length === 0 ? (
          <div className="review-empty">No reviews yet.</div>
        ) : null}
        {!reviewsLoading && !reviewsError
          ? reviews.map((review, index) => (
              <div key={`${review.name}-${index}`} className="review-card">
                <img
                  src={sentimentIcon(review.sentiment)}
                  className="review-card-icon"
                  alt="Sentiment"
                />
                <div className="review-card-body">
                  <div className="review-card-name">{review.name}</div>
                  <div className="review-card-copy">{review.review}</div>
                  <div className="review-card-meta">
                    {review.car_make} {review.car_model} {review.car_year}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Dealer;
