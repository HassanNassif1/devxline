import { useState, useEffect } from "react";

const CategoriesList = () => {
  const [data, setData] = useState({ categories: [], plans: [], features: [], addons: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/data")  // Fetching data from the '/api/data' endpoint
      .then((res) => res.json())
      .then((data) => {
        setData({
          categories: data.categories,
          plans: data.plans,
          features: data.features,
          addons: data.addons,
        });
        setLoading(false);
        
      }
    )
      
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  console.log(data,'fetcheddataaaaaaaaaa');
  if (loading) return <p className="text-center text-gray-500">Loading categories...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Our Plans & Pricing</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {data.categories.map((category) => (
          <div key={category.id} className="border p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold">{category.name}</h3>

            <h4 className="mt-4 font-bold">Plans:</h4>
            <ul className="list-disc ml-4">
              {data.plans
                .filter((plan) => plan.category_id === category.id)
                .map((plan) => (
                  <li key={plan.id} className="text-sm text-gray-500">
                    <strong>{plan.name}</strong> - ${plan.price} ({plan.delivery_days} days)
                    
                    <ul className="list-disc ml-6 mt-1">
                      {data.features
                        .filter((feature) => feature.plan_id === plan.id)
                        .map((feature) => (
                          <li key={feature.id} className="text-xs text-gray-400">{feature.feature}</li>
                        ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-bold text-center mt-10">Add-ons</h3>
      <ul className="flex justify-center gap-4 mt-4">
        {data.addons.map((addon) => (
          <li key={addon.id} className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
            {addon.name} - ${addon.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
