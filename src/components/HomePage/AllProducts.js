import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProductsAction } from "../../redux/slices/products/productSlices";
import baseURL from "../../utils/baseURL";

const AllProducts = () => {
  const dispatch = useDispatch();
  let productUrl = `${baseURL}/products`;

  useEffect(() => {
    dispatch(fetchProductsAction({ url: productUrl }));
  }, [dispatch]);

  // Get data from store
  const {
    products: { products },
    error,
    loading,
  } = useSelector((state) => state?.products);
  
  // Ensure products is an array
  const productList = Array.isArray(products) ? products : [];

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">
              Total Products [{productList.length}]
            </span>
          </h2>
          <p>Browse all our products and find the best one for you.</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {productList.length === 0 && !loading && <p>No products available.</p>}
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productList.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product.id}
              className="group relative flex flex-col items-center w-64 p-4 rounded-md border border-gray-300 hover:shadow-lg"
            >
              <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75">
                <img
                  src={product.images[0]}
                  alt={product.images[0]}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-sm font-medium text-gray-900">
                Rs {product.price}.00
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
