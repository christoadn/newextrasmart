"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 pt-20 overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-100 opacity-50 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-orange-100 opacity-50 blur-[150px] rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h2 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">
            Get In Touch
          </h2>

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Contact <span className="bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">Us</span>
          </h1>

          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-cyan-500 mx-auto rounded-full"></div>
        </motion.div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

          {/* LEFT INFO */}
          <div className="bg-black text-white p-10">
            <div>
                <h2 className="text-2xl font-semibold mb-6">
                    Contact Information
                </h2>
                <p className="text-gray-300 mb-10">
                    Say something to start a live chat!
                </p>

                <div className="space-y-6 text-sm">

                    <div className="flex items-center gap-4">
                        <Phone size={20} className="text-yellow-300" />
                        <span>+1 012 3456 789</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Mail size={20} className="text-yellow-300" />
                        <span><a href="mailto:giatnes@gmail.com">giatnes@gmail.com</a></span>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin size={20} className="text-yellow-300 mt-1" />
                        <span>
                        Jl. Walisongo V No. 1 Blok G, Pabuaran,<br />
                        Bojong Gede, Bogor, Jawa Barat
                        </span>
                    </div>

                </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-10">
            <form className="space-y-6">

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-b border-gray-300 focus:outline-none focus:border-black py-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-b border-gray-300 focus:outline-none focus:border-black py-2"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="border-b border-gray-300 focus:outline-none focus:border-black py-2"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border-b border-gray-300 focus:outline-none focus:border-black py-2"
                />
              </div>

              <textarea
                placeholder="Write your message..."
                rows={4}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black py-2"
              />

              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* MAPS */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.5325895228866!2d106.7961795!3d-6.4539925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e9c2f9e2b305%3A0xfac899f9d335dfbc!2sNew%20Extra%20Smart%20Pabuaran!5e0!3m2!1sid!2sid!4v1772203847011!5m2!1sid!2sid"
            width="100%"
            height="400"
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>

      </section>
    </main>
  );
}