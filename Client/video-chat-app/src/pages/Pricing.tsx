import Navbar from "../components/Navbar";

const pricingPlans = [
  {
    name: "Basic",
    price: "$0 / mo",
    features: [
      "1:1 Video Calls",
      "Limited Participants",
      "Standard Quality",
    ],
  },
  {
    name: "Pro",
    price: "$15 / mo",
    features: [
      "Group Video Calls",
      "High-Quality Streaming",
      "Screen Sharing",
      "Custom Room Names",
    ],
  },
  {
    name: "Enterprise",
    price: "$50 / mo",
    features: [
      "Unlimited Participants",
      "Full HD Video & Audio",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <Navbar />

      <section className="mt-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          Pricing Plans
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Choose the plan that suits your video calling needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">{plan.name}</h2>
              <p className="text-gray-700 text-lg mb-4">{plan.price}</p>
              <ul className="text-gray-600 mb-4 space-y-1">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx}>• {feature}</li>
                ))}
              </ul>
              <button className="bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-semibold py-2 rounded-lg shadow-md">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-gray-600 py-6 mt-16 border-t border-gray-200">
        © {new Date().getFullYear()} VideoMeet — All Rights Reserved.
      </footer>
    </div>
  );
};

export default Pricing;
