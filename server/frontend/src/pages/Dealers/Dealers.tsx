import { useEffect, useState } from "react";
import { Link } from "react-router";

import review_icon from "@/assets/reviewicon.png";
import { useDealers } from "@/hooks/useDealers";

import "./Dealers.css";
import Header from "@/components/layout/Header";

const Dealers = () => {
  const [selectedState, setSelectedState] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: dealers = [], isLoading, isError } = useDealers();

  const states = Array.from(
    new Set(dealers.map((dealer) => dealer.state)),
  ).sort();
  const filteredDealers =
    selectedState === "All"
      ? dealers
      : dealers.filter((dealer) => dealer.state === selectedState);
  const totalItems = filteredDealers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedDealers = filteredDealers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const isLoggedIn = sessionStorage.getItem("username") !== null;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedState, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="dealers-page">
      <Header />
      <div className="dealers-shell">
        <section className="dealers-hero">
          <div>
            <p className="dealers-eyebrow">Dealership directory</p>
            <h1 className="dealers-title">
              Browse dealers with pagination and filters
            </h1>
            <p className="dealers-description">
              Narrow the list by state, choose how many rows to show, and move
              through pages without losing your place.
            </p>
          </div>

          <div className="dealers-summary">
            <span className="summary-label">Visible dealers</span>
            <strong>{totalItems}</strong>
            <span className="summary-meta">
              Page {safeCurrentPage} of {totalPages}
            </span>
          </div>
        </section>
      </div>

      {isLoading ? (
        <div className="dealer-loading">Loading dealers...</div>
      ) : null}
      {isError ? (
        <div className="dealer-error">Unable to load dealers.</div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="dealers-shell">
          <div className="dealers-card">
            <div className="dealers-toolbar">
              <label className="dealers-control">
                <span>State</span>
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
              </label>

              <label className="dealers-control">
                <span>Items per page</span>
                <select
                  name="itemsPerPage"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  {[5, 10, 15, 25].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="table-wrap">
              <table className="dealers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dealer Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Zip</th>
                    <th>State</th>
                    {isLoggedIn ? <th>Review Dealer</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {paginatedDealers.length > 0 ? (
                    paginatedDealers.map((dealer) => (
                      <tr key={dealer.id}>
                        <td>{dealer.id}</td>
                        <td>
                          <Link to={`/dealer/${dealer.id}`}>
                            {dealer.full_name}
                          </Link>
                        </td>
                        <td>{dealer.city}</td>
                        <td>{dealer.address}</td>
                        <td>{dealer.zip}</td>
                        <td>{dealer.state}</td>
                        {isLoggedIn ? (
                          <td>
                            <Link
                              to={`/postreview/${dealer.id}`}
                              className="review-link"
                            >
                              <img
                                src={review_icon}
                                className="review_icon"
                                alt={`Post a review for ${dealer.full_name}`}
                              />
                            </Link>
                          </td>
                        ) : null}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isLoggedIn ? 7 : 6} className="empty-state">
                        No dealers match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="dealers-footer">
              <p className="dealers-range">
                Showing {totalItems === 0 ? 0 : startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems}
              </p>

              <div className="pagination">
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={safeCurrentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-pages" aria-label="Pagination pages">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={
                        page === safeCurrentPage
                          ? "pagination-button active"
                          : "pagination-button"
                      }
                      onClick={() => setCurrentPage(page)}
                      aria-current={
                        page === safeCurrentPage ? "page" : undefined
                      }
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={safeCurrentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dealers;
