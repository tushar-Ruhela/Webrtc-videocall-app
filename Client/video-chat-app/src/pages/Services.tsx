import Navbar from "../components/Navbar";

const servicesList = [
  {
    title: "High-Quality Video Calls",
    description: "Enjoy crystal-clear video calls with minimal latency and smooth streaming.",
  },
  {
    title: "Screen Sharing",
    description: "Share your screen in real-time for presentations, tutorials, and collaborations.",
  },
  {
    title: "Multi-Participant Rooms",
    description: "Host meetings with multiple participants easily without any limit hassles.",
  },
  {
    title: "Secure & Encrypted",
    description: "All your calls are protected with end-to-end encryption for maximum privacy.",
  },
];

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <Navbar />

      <section className="mt-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          Our Services
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          Discover the powerful features we offer to make your video calling experience seamless and professional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600">{service.description}</p>
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

export default Services;
