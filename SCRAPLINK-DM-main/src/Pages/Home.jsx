import BestSeller from "../Components/BestSeller";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import NewsLetterBox from "../Components/NewsLetterBox";
import OurPolicies from "../Components/OurPolicies";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      <LatestCollection products={products} />
      <BestSeller />
      <OurPolicies />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
