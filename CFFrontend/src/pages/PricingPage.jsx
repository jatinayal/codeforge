import React, { useState } from 'react';
import { Zap, Crown, Gem, CheckCircle, XCircle, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserPlan } from '../authSlice';

const PricingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Zap,
      features: [
        'Access to 100+ problems',
        'Basic code editor',
        'Community support',
        'Video solutions'
      ],
      limitations: ['Premium problems'],
      buttonText: 'Get Started',
      popular: false,
      color: 'gray'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 199,
      period: 'month',
      icon: Crown,
      features: [
        'Access to all 500+ problems',
        'Advanced code editor',
        'Video solutions',
        'Priority support',
        'Exclusive contests'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      popular: true,
      color: 'yellow'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      period: 'month',
      icon: Gem,
      features: [
        'Everything in Pro',
        '1-on-1 mentorship',
        'Certification programs',
        'Job placement assistance',
        'Early access to new features'
      ],
      limitations: [],
      buttonText: 'Go Premium',
      popular: false,
      color: 'purple'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const simulatePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user plan in backend - only send isPaid: true
      const response = await axiosClient.post('/user/updatePlan', {
        isPaid: true
      });
      
      // Update user in Redux store - only update isPaid
      dispatch(updateUserPlan({
        isPaid: true
      }));
      
      setPaymentSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        setShowPaymentModal(false);
        navigate('/problems');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full p-6 bg-[#0a0a0a] border border-[#333333] rounded-xl shadow-xl">
          {!paymentSuccess ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                {selectedPlan.id === 'free' ? 'Confirm Free Plan' : 'Payment Details'}
              </h2>
              
              <div className="mb-6 p-4 bg-[#111111] rounded-lg border border-[#333333]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Plan:</span>
                  <span className="text-white font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-yellow-500 font-bold">₹{selectedPlan.price}</span>
                </div>
              </div>
              
              {selectedPlan.id !== 'free' ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-2">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 mb-2">CVV</label>
                        <input 
                          type="text" 
                          placeholder="123" 
                          className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-yellow-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 bg-[#111111] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <Lock size={16} />
                    <span className="text-sm">Your payment is secure and encrypted</span>
                  </div>
                </>
              ) : (
                <div className="mb-6 text-center text-gray-300">
                  <p>No payment required for the Free plan. Click Confirm to activate your account.</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-lg border border-[#333333] hover:border-gray-500 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={simulatePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  ) : selectedPlan.id === 'free' ? (
                    'Confirm'
                  ) : (
                    `Pay ₹${selectedPlan.price}`
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedPlan.id === 'free' ? 'Plan Activated!' : 'Payment Successful!'}
              </h3>
              <p className="text-gray-400 mb-6">
                {selectedPlan.id === 'free' 
                  ? 'Your free account has been activated.' 
                  : 'Your account has been upgraded to premium.'
                }
              </p>
              <div className="animate-pulse text-yellow-500">
                Redirecting to problems page...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black py-8 px-4">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Unlock your full potential with our flexible pricing options. 
          {authUser?.isPaid ? ' You currently have a premium account.' : ' Start with free access or upgrade for more features.'}
        </p>
      </div>
      
      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isPaidUser = authUser?.isPaid;
          
          return (
            <div 
              key={plan.id}
              className={`bg-[#111111] border rounded-xl p-6 relative transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-2 border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20' 
                  : 'border-gray-800 hover:border-yellow-500/30'
              } ${isPaidUser && plan.id !== 'free' ? 'ring-2 ring-yellow-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}
              
              {isPaidUser && plan.id !== 'free' && (
                <div className="absolute top-10 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  CURRENT PLAN
                </div>
              )}
              
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 ${
                    plan.color === 'yellow' ? 'bg-yellow-500/20' : 
                    plan.color === 'purple' ? 'bg-purple-500/10' : 'bg-yellow-500/10'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      plan.color === 'yellow' ? 'text-yellow-500' : 
                      plan.color === 'purple' ? 'text-purple-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-3xl font-bold">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-400 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">
                    {plan.id === 'free' ? 'Perfect for beginners starting their coding journey' :
                     plan.id === 'pro' ? 'For serious coders who want to level up their skills' :
                     'For those who want the complete CodeForge experience'}
                  </p>
                </div>
                
                <div className="flex-grow mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isPaidUser}
                  className={`w-full font-medium py-3 rounded-lg transition-colors ${
                    isPaidUser
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      : plan.color === 'yellow'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : plan.color === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isPaidUser ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      <PaymentModal />

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Can I change my plan later?</h3>
            <p className="text-gray-400">All paid plans give you full access to premium features. You can cancel anytime.</p>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Do you offer refunds?</h3>
            <p className="text-gray-400">We offer a 7-day money-back guarantee if you're not satisfied.</p>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">How does the free plan work?</h3>
            <p className="text-gray-400">The free plan gives you access to a limited set of problems and basic features forever.</p>
          </div>
          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400">We accept all major credit cards, debit cards, and UPI payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;