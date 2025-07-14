// import { Mail, MapPin, Phone, Send } from "lucide-react";
// import { useState } from "react";

// export default function ContactUs() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       setSubmitSuccess(true);
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
//             Contact Us
//           </h1>
//           <p className="text-gray-400 max-w-2xl mx-auto">
//             Have questions or feedback? We'd love to hear from you. Fill out the
//             form below or use our contact information.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           {/* Contact Information */}
//           <div className="space-y-6">
//             <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-gray-800 p-3 rounded-full">
//                   <Mail className="h-6 w-6 text-yellow-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-1">Email Us</h3>
//                   <p className="text-gray-400">support@motoket.com</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-gray-800 p-3 rounded-full">
//                   <Phone className="h-6 w-6 text-yellow-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-1">Call Us</h3>
//                   <p className="text-gray-400">+1 (555) 123-4567</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-gray-800 p-3 rounded-full">
//                   <MapPin className="h-6 w-6 text-yellow-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
//                   <p className="text-gray-400">
//                     123 Auto Street
//                     <br />
//                     Motor City, MC 12345
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
//               <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
//               <ul className="space-y-2 text-gray-400">
//                 <li className="flex justify-between">
//                   <span>Monday - Friday</span>
//                   <span>9:00 AM - 6:00 PM</span>
//                 </li>
//                 <li className="flex justify-between">
//                   <span>Saturday</span>
//                   <span>10:00 AM - 4:00 PM</span>
//                 </li>
//                 <li className="flex justify-between">
//                   <span>Sunday</span>
//                   <span>Closed</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
//             {submitSuccess ? (
//               <div className="text-center py-8">
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4">
//                   <Send className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="text-lg font-medium text-white mb-2">
//                   Message Sent!
//                 </h3>
//                 <p className="text-gray-400 mb-6">
//                   Thank you for contacting us. We'll get back to you within 24
//                   hours.
//                 </p>
//                 <button
//                   onClick={() => setSubmitSuccess(false)}
//                   className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
//                 >
//                   Send Another Message
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label htmlFor="name" className="block text-gray-300 mb-2">
//                       Your Name *
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="block text-gray-300 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="subject"
//                       className="block text-gray-300 mb-2"
//                     >
//                       Subject *
//                     </label>
//                     <input
//                       type="text"
//                       id="subject"
//                       name="subject"
//                       value={formData.subject}
//                       onChange={handleInputChange}
//                       className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="message"
//                       className="block text-gray-300 mb-2"
//                     >
//                       Your Message *
//                     </label>
//                     <textarea
//                       id="message"
//                       name="message"
//                       rows={5}
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors resize-none"
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className={`w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
//                       isSubmitting
//                         ? "opacity-70 cursor-not-allowed"
//                         : "hover:opacity-90"
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         <span>Sending...</span>
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-5 w-5" />
//                         <span>Send Message</span>
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
            Have questions or feedback? We'd love to hear from you. Fill out the
            form below or use our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="h-6 w-6 text-yellow-500" />,
                title: "Email Us",
                info: "support@motoket.com",
              },
              {
                icon: <Phone className="h-6 w-6 text-yellow-500" />,
                title: "Call Us",
                info: "+1 (555) 123-4567",
              },
              {
                icon: <MapPin className="h-6 w-6 text-yellow-500" />,
                title: "Visit Us",
                info: (
                  <>
                    123 Auto Street
                    <br />
                    Motor City, MC 12345
                  </>
                ),
              },
            ].map(({ icon, title, info }, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-800 p-3 rounded-full">{icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <p className="text-gray-400">{info}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                {[
                  ["Monday - Friday", "9:00 AM - 6:00 PM"],
                  ["Saturday", "10:00 AM - 4:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours], idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{day}</span>
                    <span>{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-700 shadow-2xl">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-400 mb-6">
                  Thank you for contacting us. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  {[
                    { id: "name", label: "Your Name", type: "text" },
                    { id: "email", label: "Email Address", type: "email" },
                    { id: "subject", label: "Subject", type: "text" },
                  ].map(({ id, label, type }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-gray-300 mb-2">
                        {label} *
                      </label>
                      <input
                        type={type}
                        id={id}
                        name={id}
                        value={formData[id]}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition"
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 mb-2"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:opacity-90"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
