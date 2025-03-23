import PropTypes from "prop-types";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, product }) => {
  return (
    <Link
      to={`/product/${id}`} // Pass the product ID in the URL
      state={{ product }} // Pass the entire product data as state
      className="block text-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="overflow-hidden border rounded-lg p-4 shadow-sm h-[300px] flex flex-col">
        {/* Product Image */}
        <div className="flex-1 overflow-hidden">
          <img
            src={image} // Use the first image in the array as the main image
            alt={name}
            className="w-full h-48 object-cover mb-2 rounded-lg hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <p className="pt-3 pb-1 text-sm font-medium truncate" title={name}>
            {name}
          </p>
          <p className="text-sm font-semibold">
            {price.toFixed(2)} {/* Format price to 2 decimal places */}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Prop validation
ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  price: PropTypes.number.isRequired,
  product: PropTypes.object.isRequired, // Add product prop validation
};

export default ProductItem;
