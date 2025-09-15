import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import logoCF from '../assets/logoCF2.png'
import { registerUser } from "../authSlice";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  AlertCircle, 
  Sparkles,
  BrainCircuit,
  CheckSquare, 
  Square
} from "lucide-react";

const signupSchema = z 
  .object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password should contain at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Create floating particles effect
  useEffect(() => {
    const particlesArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(particlesArray);
  }, []);

  // Display server errors
  useEffect(() => {
    if (error) {
      setError('root.serverError', {
        type: 'server',
        message: error
      });
    }
  }, [error, setError]);

  const submittedData = (data) => {
    const serverData = {
      firstName: data.firstName,
      emailId: data.email,
      password: data.password
    };
    
    dispatch(registerUser(serverData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-yellow-500/20"
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-[#000000]/80 backdrop-blur-md border border-[#333333] rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={logoCF} 
                alt="CodeForge Logo" 
                className="h-10 mr-2" 
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-100">
                CodeForge
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Start your coding journey with us</p>
          </div>

          <form onSubmit={handleSubmit(submittedData)} className="space-y-5">
            {/* First Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
                <User size={20} className="text-gray-400" />
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                />
              </label>
              {errors.firstName && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
                <Mail size={20} className="text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                />
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
                <Lock size={20} className="text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 px-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus-within:border-yellow-500 transition-colors">
                <Lock size={20} className="text-gray-400" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                  className="text-yellow-500 focus:outline-none mt-1"
                >
                  {agreeToTerms ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <input
                  {...register("agreeToTerms")}
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="hidden"
                />
                <span className="text-gray-300 text-sm">
                  I agree to the <Link to="/terms" className="text-yellow-500 hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-yellow-500 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

          

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Sign Up
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#333333] flex-grow"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="border-t border-[#333333] flex-grow"></div>
            </div>

            {/* Login link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm mt-6 flex items-center justify-center gap-1">
          <BrainCircuit size={16} />
          Join thousands of developers improving their skills
        </p>
      </div>

      {/* Add custom animations */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>
    </div>
  );
}

export default Signup;