
import { Link } from "react-router-dom";
import { FaVideo, FaLock, FaComments, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Mainfrontpage = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
       <Navbar />
  <main className="pt-16">  
  </main>
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16 md:py-24">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Connect Seamlessly with <span className="text-blue-500">VideoMeet</span>
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          Experience high-quality video calls, real-time chat, and secure meetings — all in one place.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-500 transition px-6 py-3 rounded-lg font-semibold"
          >
            Join a Meeting
          </Link>
          <button className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 md:px-16 bg-gray-800">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-10">App Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg text-center">
            <FaVideo className="mx-auto text-blue-500 text-3xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">HD Video Calls</h4>
            <p className="text-gray-400 text-sm">
              Enjoy smooth, high-definition video calls with friends or colleagues.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg text-center">
            <FaComments className="mx-auto text-blue-500 text-3xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Real-time Chat</h4>
            <p className="text-gray-400 text-sm">
              Chat instantly with participants while in the meeting.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg text-center">
            <FaLock className="mx-auto text-blue-500 text-3xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
            <p className="text-gray-400 text-sm">
              All your communications are encrypted and private.
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl shadow-lg text-center">
            <FaUsers className="mx-auto text-blue-500 text-3xl mb-4" />
            <h4 className="text-xl font-semibold mb-2">Multi-User Support</h4>
            <p className="text-gray-400 text-sm">
              Host or join group meetings effortlessly with multiple participants.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="policies" className="bg-gray-950 text-gray-400 py-8 px-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Videomeet. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Mainfrontpage;
