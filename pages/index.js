import Head from "next/head";

import { Configuration, OpenAIApi } from "openai";
import { XCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

export default function Home() {
  const [propertyType, setPropertyType] = useState("");
  const [stories, setStories] = useState("");
  const [sqft, setSqft] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [garage, setGarage] = useState("");
  const [pool, setPool] = useState(false);
  const [shed, setShed] = useState(false);
  const [patio, setPatio] = useState(false);
  const [solarPanels, setSolarPanels] = useState(false);
  const [gasCooking, setGasCooking] = useState(false);
  const [sprinklers, setSprinklers] = useState(false);
  const [listingResponse, setListingResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  //OPEN API//
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAPI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const handleGenerateListing = async (e) => {
    e.preventDefault();
    if (
      propertyType === "" ||
      stories === "" ||
      sqft === "" ||
      beds === "" ||
      baths === "" ||
      garage === ""
    ) {
      setError(true);
      return;
    }
    setLoading(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a listing about a ${
        stories > 1 ? `${stories} ${propertyType}` : `1 story ${propertyType}`
      } that is ${sqft} square feet ${
        garage >= 1 ? `${garage} car garage` : ""
      } and has ${beds} bedrooms and ${baths} bathrooms ${
        pool ? "It also has a pool" : ""
      } ${gasCooking ? "It has gas cooking" : ""} ${
        patio ? "It Has a patio" : ""
      } ${shed ? "It Has a shed" : ""}.${
        sprinklers ? "It has a sprinkler system" : ""
      } ${solarPanels ? "It comes with solar panels" : ""}`,
      temperature: 1,
      max_tokens: 250,
    });
    setListingResponse(response.data);
    setError(false);
    setLoading(false);
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Listing Generator</title>
        <meta
          name="description"
          content="Listing Generator using the power of AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <RingLoader color="#560DF8" />
          </div>
        )}

        <div className="form-control absolute  right-6 top-20 md:top-0 md:right-10">
          <label className="label cursor-pointer space-x-2">
            <span className="hidden md:block md:label-text">
              Toggle Dark Mode
            </span>
            <input type="checkbox" className="toggle" onClick={toggleTheme} />
          </label>
        </div>

        <div className="flex flex-col items-center justify-center py-3">
          <h1 className="text-4xl">Listing Generator</h1>
          <p>A listing generator using the power of AI</p>
        </div>

        {error && (
          <div className="flex items-center justify-center">
            <h1 className="text-red-400">All input fields must be field out</h1>
          </div>
        )}

        <form className="my-3 flex flex-col items-center justify-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">House/Apartment/Condo</span>
            </label>
            <select
              className="select-bordered select"
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="house">House</option>
              <option value="aparment">Apartment</option>
              <option value="condo">Condo</option>
            </select>
            {/* //Stories// */}
            <label className="label">
              <span className="label-text">How many stories?</span>
            </label>
            <input
              type="text"
              placeholder="Stories"
              value={stories}
              className="input-bordered input-primary input w-full max-w-xs"
              onChange={(e) => setStories(e.target.value)}
            />
            {/* // SqFt // */}
            <label className="label">
              <span className="label-text">
                Square footage of Home/Apartment/Condo
              </span>
            </label>
            <input
              type="text"
              placeholder="Sq. Ft."
              value={sqft}
              className="input-bordered input-primary input w-full max-w-xs"
              onChange={(e) => setSqft(e.target.value)}
            />
            {/* // Garage // */}
            <label className="label">
              <span className="label-text"># of Car Garage</span>
            </label>
            <input
              type="text"
              placeholder="Garage"
              value={garage}
              className="input-bordered input-primary input w-full max-w-xs"
              onChange={(e) => setGarage(e.target.value)}
            />
            {/* // No. Of Beds. // */}
            <label className="label">
              <span className="label-text">Number of bedrooms</span>
            </label>
            <input
              type="text"
              placeholder="0"
              className="input-bordered input-primary input w-full max-w-xs"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
            />
            {/* // No. of Baths // */}
            <label className="label">
              <span className="label-text">Number of bathrooms</span>
            </label>
            <input
              type="text"
              placeholder="0"
              className="input-bordered input-primary input w-full max-w-xs"
              value={baths}
              onChange={(e) => setBaths(e.target.value)}
            />
            {/* // CHECK BOXES // */}
            <div className="flex gap-6">
              <div className="w-1/2">
                {/* //Patio//  */}
                <label className="label cursor-pointer">
                  <span className="label-text">Patio</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setPatio(e.target.checked)}
                  />
                  {/* //Pool// */}
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text">Pool</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setPool(e.target.checked)}
                  />
                </label>
                {/* //Shed// */}
                <label className="label cursor-pointer">
                  <span className="label-text">Shed</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setShed(e.target.checked)}
                  />
                </label>
                {/* //Solar Panels// */}
                <label className="label cursor-pointer">
                  <span className="label-text">Solar Panels</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setSolarPanels(e.target.checked)}
                  />
                </label>
              </div>
              <div className="w-1/2">
                {/* //Patio//  */}
                <label className="label cursor-pointer">
                  <span className="label-text">Sprinklers</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setSprinklers(e.target.checked)}
                  />
                  {/* //Pool// */}
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text">Gas Cooking</span>
                  <input
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    onChange={(e) => setGasCooking(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="my-3">
            <button className="btn-primary btn" onClick={handleGenerateListing}>
              Generate Listing
            </button>
          </div>
        </form>

        {showModal && (
          <div className="flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform md:w-auto  ">
              <div className="modal-box w-full max-w-5xl">
                <div className="absolute right-10 top-4 cursor-pointer text-[#560DF8]">
                  <XCircle size={32} onClick={() => setShowModal(false)} />
                </div>
                <h3 className="text-lg font-bold">Generated Listing</h3>
                <p className="py-4">
                  <p className="text-lg">
                    {listingResponse && listingResponse.choices[0].text}
                  </p>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
