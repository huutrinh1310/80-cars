import { useState } from "react";
import { useParams } from "react-router";

import Header from "@/components/layout/Header";
import { useCarModels, useDealer, usePostReviewMutation } from "@/hooks/useDealers";

import "./Dealers.css";


const PostReview = () => {
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const { id } = useParams();
  const { data: dealer } = useDealer(id);
  const { data: carmodels = [] } = useCarModels();
  const postReviewMutation = usePostReviewMutation(id);

  const postreview = async () => {
    let name = `${sessionStorage.getItem("firstname")} ${sessionStorage.getItem("lastname")}`;
    //If the first and second name are stores as null, use the username
    if (name.includes("null")) {
      name = sessionStorage.getItem("username") ?? "";
    }
    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const [makeChosen, ...modelParts] = model.split(" ");
    const modelChosen = modelParts.join(" ");

    try {
      await postReviewMutation.mutateAsync({
        name,
        dealership: id ?? "",
        review,
        purchase: true,
        purchase_date: date,
        car_make: makeChosen,
        car_model: modelChosen,
        car_year: year,
      });

      window.location.href = `${window.location.origin}/dealer/${id}`;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to post review.";
      alert(message);
    }
  };


  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer?.full_name}</h1>
        <textarea
          id="review"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="input_field">
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="input_field">
          Car Make
          <select name="cars" id="cars" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled>
              Choose Car Make and Model
            </option>
            {carmodels.map((carmodel) => (
              <option
                key={`${carmodel.CarMake}-${carmodel.CarModel}`}
                value={`${carmodel.CarMake} ${carmodel.CarModel}`}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>

        <div>
          <button className="postreview" onClick={postreview} disabled={postReviewMutation.isPending}>
            {postReviewMutation.isPending ? "Posting..." : "Post Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
