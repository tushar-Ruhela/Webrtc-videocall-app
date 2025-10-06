import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          About VideoMeet
        </h1>
        <p className="text-gray-700 max-w-2xl mb-6">
          VideoMeet is a modern video calling application that allows you to 
          connect with your colleagues, friends, and family instantly. Experience 
          seamless communication with crystal-clear video and audio quality.
        </p>
        <img
          src="https://via.placeholder.com/800x400.png?text=Video+Call+Illustration"
          alt="Video call illustration"
          className="rounded-xl shadow-lg w-full max-w-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">High Quality Video</h3>
            <p className="text-gray-600">
              Enjoy high-definition video calls with minimal latency.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Audio Control</h3>
            <p className="text-gray-600">
              Mute/unmute your microphone or control speaker audio easily.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Secure Rooms</h3>
            <p className="text-gray-600">
              Private rooms ensure your calls are safe and secure.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Cross Platform</h3>
            <p className="text-gray-600">
              Connect from any device including mobile, tablet, and desktop.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Instant Join</h3>
            <p className="text-gray-600">
              Join a room instantly with a room code and start calling.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Easy Login</h3>
            <p className="text-gray-600">
              Log in quickly and securely to access your video rooms.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 mt-16 border-t border-gray-200">
        © {new Date().getFullYear()} VideoMeet — All Rights Reserved.
      </footer>
    </div>
  );
};

export default About;
