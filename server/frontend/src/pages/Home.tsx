import Header from "@/components/layout/Header";

export function Home() {
  return (
    <div className="dealers-page">
      <Header />
      <div className="flex flex-col mt-10 h-screen">
        <div className="banner mx-auto flex flex-col items-center">
          <h1>Welcome to our Dealerships!</h1>
          <a href="/dealers" className="btn btn-primary">
            View Dealerships
          </a>
        </div>
        <div
          className="card"
          style={{ width: "50%", marginTop: "50px", alignSelf: "center" }}
        >
          <img
            src="static/car_dealership.jpg"
            className="card-img-top shadow-lg rounded-lg"
            alt="..."
          />
        </div>
      </div>
    </div>
  );
}
