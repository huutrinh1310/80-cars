import { useState } from "react";
import { Link } from "react-router";

import review_icon from "@/assets/reviewicon.png";
import Header from "@/components/layout/Header";
import { useDealers } from "@/hooks/useDealers";

import "./Dealers.css";

const Dealers = () => {
  const [selectedState, setSelectedState] = useState("All");
  const { data: dealers = [], isLoading, isError } = useDealers();

  const states = Array.from(new Set(dealers.map((dealer) => dealer.state))).sort();
  const filteredDealers =
    selectedState === "All"
      ? dealers
      : dealers.filter((dealer) => dealer.state === selectedState);
  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      <Header />

      {isLoading ? <div className="m-4">Loading dealers...</div> : null}
      {isError ? <div className="m-4">Unable to load dealers.</div> : null}

      {!isLoading && !isError ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>
                <select
                  name="state"
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="All">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </th>
              {isLoggedIn ? <th>Review Dealer</th> : null}
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <Link to={`/dealer/${dealer.id}`}>{dealer.full_name}</Link>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn ? (
                  <td>
                    <Link to={`/postreview/${dealer.id}`}>
                      <img src={review_icon} className="review_icon" alt="Post Review" />
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default Dealers;
