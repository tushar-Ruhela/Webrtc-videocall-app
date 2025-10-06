import { useForm, type SubmitHandler } from "react-hook-form";
import Navbar from "../components/Navbar";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    // Demo: Show alert
    alert(`Message Sent!\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`);
    // Reset form
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Navbar */}
      <Navbar />

      <section className="flex flex-col items-center mt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 max-w-2xl mb-10 text-center">
          Have questions or feedback? Reach out to us using the form below and we will get back to you as soon as possible.
        </p>

        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-purple-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your Email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Your message..."
                rows={5}
                {...register("message", { required: "Message is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-semibold py-2 rounded-lg shadow-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-6 mt-16 border-t border-gray-200">
        © {new Date().getFullYear()} VideoMeet — All Rights Reserved.
      </footer>
    </div>
  );
};

export default Contact;
