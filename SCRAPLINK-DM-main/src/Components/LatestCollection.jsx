import { useEffect, useState } from "react";
import Title from "../Components/Title";
import ProductItem from "../Components/ProductItem";

const LatestCollection = ({ products }) => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const latest = products.slice(0, 10);
      setLatestProducts(latest);
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title text1={"RECENT"} text2={"DEALS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Embrace sustainability by recycling scrap materials efficiently and
          support for a greener future.
        </p>
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((product, idx) => {
          return (
            <ProductItem
              key={idx}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              product={product} // Pass the entire product object
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
