import Header from "@/components/layout/Header";

export function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <div
          className="card"
          style={{ width: "50%", marginTop: "50px", alignSelf: "center" }}
        >
          <img
            src="static/car_dealership.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="banner">
            <h5>Welcome to our Dealerships!</h5>
            <a
              href="/dealers"
              className="btn"
              style={{ backgroundColor: "aqua", margin: "10px" }}
            >
              View Dealerships
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
