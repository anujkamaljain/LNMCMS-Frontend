import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            title: "Easy Complaint Registration",
            description: "Register your complaints quickly with our streamlined process and track their status in real-time."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
            title: "Direct Communication",
            description: "Chat directly with administrators for faster resolution of your issues."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Dashboard Analytics",
            description: "View comprehensive analytics and insights about complaint trends and resolution times."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Secure & Private",
            description: "Your data is protected with enterprise-grade security and role-based access control."
        }
    ];

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="absolute inset-0 bg-[url('/ERryvXnU4AATNh-.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black opacity-60" />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <motion.main
                    className="flex-grow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="container mx-auto px-4 py-12 md:py-20">
                        {/* Hero Content */}
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="badge bg-orange-600 text-white badge-lg mb-4">LNMIIT</span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Campus Complaint <br />
                                <span className="text-orange-600">Management System</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                                A streamlined platform for LNMIIT students to register, track, and resolve
                                campus-related complaints with ease and transparency.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="btn bg-orange-600 hover:bg-orange-700 border-none text-white btn-lg text-lg px-8"
                                    onClick={() => navigate("/login")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="card-body items-center text-center">
                                        <div className="text-orange-600 mb-3">
                                            {feature.icon}
                                        </div>
                                        <h3 className="card-title text-lg">{feature.title}</h3>
                                        <p className="text-sm text-base-content/70">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div
                            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            {[
                                { value: "24/7", label: "Support Available" },
                                { value: "Fast", label: "Resolution Time" },
                                { value: "100%", label: "Transparency" },
                                { value: "Secure", label: "Data Protected" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center p-4 bg-base-100/30 backdrop-blur-sm rounded-lg">
                                    <div className="text-2xl md:text-3xl font-bold text-orange-600">{stat.value}</div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.main>

                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
