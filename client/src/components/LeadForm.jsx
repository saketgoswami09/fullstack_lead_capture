import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmitLeadMutation } from '../store/leadsApi';
import { CheckCircle, AlertCircle, Loader2, Check } from 'lucide-react';

const BUDGET_OPTIONS = [
  { value: '',     label: 'Select budget range…' },
  { value: '<1k',  label: 'Under $1,000' },
  { value: '1k-5k',  label: '$1,000 – $5,000' },
  { value: '5k-10k', label: '$5,000 – $10,000' },
  { value: '>10k',   label: 'Above $10,000' },
];

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitLead, { isLoading, error }] = useSubmitLeadMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ 
    // onTouched prevents aggressive errors on first type, but gives instant feedback once they leave the field
    mode: 'onTouched' 
  });

  const onSubmit = async (data) => {
    try {
      await submitLead(data).unwrap();
      setSubmitted(true);
      reset();
    } catch {
      // API error handled below
    }
  };

  const serverError =
    error?.data?.errors?.[0]?.message ||
    error?.data?.message ||
    (error ? 'Oops, something went wrong—refresh and try again?' : null);

  // ─── Stripe-Style Dynamic Styling ───────────────────────────────────────
  const labelStyles = "block text-xs font-semibold text-gray-600 mb-1.5 transition-colors";
  
  const getBaseInputStyles = (hasError, isSuccess) => {
    // Base layout: padded right side for icons, soft shadows, and a thick but highly transparent focus ring
    const base = "w-full px-4 py-2.5 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-300 shadow-sm ";
    
    if (hasError) {
      return base + "bg-rose-50/30 border border-rose-200 focus:border-rose-400 focus:ring-rose-500/20 text-rose-900 pr-10";
    }
    if (isSuccess) {
      return base + "bg-gray-50/50 border border-gray-200 focus:border-emerald-400 focus:ring-emerald-500/20 text-gray-900 pr-10";
    }
    return base + "bg-gray-50/50 border border-gray-200 focus:border-blue-400 focus:ring-blue-500/20 text-gray-900 pr-10";
  };

  if (submitted) {
    return (
      // Added min-h-[480px] to match the form height, and softened the background opacities
      <div className="flex flex-col items-center justify-center min-h-[480px] p-8 text-center bg-emerald-50/30 border border-emerald-100/50 rounded-2xl animate-fade-up" role="alert">
        <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-emerald-100/50 text-emerald-600 shadow-sm">
          <Check className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message received</h3>
        <p className="text-base text-gray-600 mb-8">We'll review your details and respond within 24 hours.</p>
        <button 
          className="px-6 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 rounded-xl transition-colors"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)} noValidate>
      
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelStyles}>Full Name</label>
        <div className="relative">
          <input
            id="name"
            type="text"
            placeholder="Jane Smith"
            className={getBaseInputStyles(!!errors.name, dirtyFields.name && !errors.name)}
            {...register('name', {
              required: 'Mind filling this out? It helps us personalize our chat.',
              minLength: { value: 2, message: 'Please provide at least 2 characters.' },
              maxLength: { value: 100, message: 'Name cannot exceed 100 characters.' },
            })}
          />
          {/* Live Validation Feedback Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {errors.name ? (
              <span className="animate-fade-up"><AlertCircle className="w-5 h-5 text-rose-400" strokeWidth={2} /></span>
            ) : dirtyFields.name ? (
              <span className="animate-fade-up"><CheckCircle className="w-5 h-5 text-emerald-400" strokeWidth={2} /></span>
            ) : null}
          </div>
        </div>
        {/* Fixed height wrapper to prevent layout jump on error */}
        <div className="min-h-[1.5rem] pt-1">
          {errors.name && (
            <span className="text-xs font-medium text-rose-500 animate-fade-up" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelStyles}>Email Address</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="jane@example.com"
            className={getBaseInputStyles(!!errors.email, dirtyFields.email && !errors.email)}
            {...register('email', {
              required: 'Mind filling this out? It helps us get things just right.',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Hmm, please enter a valid email address.' },
            })}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {errors.email ? (
              <span className="animate-fade-up"><AlertCircle className="w-5 h-5 text-rose-400" strokeWidth={2} /></span>
            ) : dirtyFields.email ? (
              <span className="animate-fade-up"><CheckCircle className="w-5 h-5 text-emerald-400" strokeWidth={2} /></span>
            ) : null}
          </div>
        </div>
        <div className="min-h-[1.5rem] pt-1">
          {errors.email ? (
            <span className="text-xs font-medium text-rose-500 animate-fade-up" role="alert">
              {errors.email.message}
            </span>
          ) : (
            <span className="text-xs text-gray-500">We will use this to send your proposal.</span>
          )}
        </div>
      </div>

      {/* Budget Range (No right-side icon here to avoid overlapping native dropdown arrow) */}
      <div>
        <label htmlFor="budgetRange" className={labelStyles}>Budget Range</label>
        <select
          id="budgetRange"
          // We don't pass 'pr-10' here to let the native select arrow breathe
          className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 transition-all duration-300 shadow-sm ${
            errors.budgetRange 
              ? 'bg-rose-50/30 border border-rose-200 focus:border-rose-400 focus:ring-rose-500/20 text-rose-900'
              : 'bg-gray-50/50 border border-gray-200 focus:border-blue-400 focus:ring-blue-500/20 text-gray-900'
          }`}
          {...register('budgetRange', { required: 'Knowing your budget helps us recommend the right solution.' })}
        >
          {BUDGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} disabled={!o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="min-h-[1.5rem] pt-1">
          {errors.budgetRange && (
            <span className="text-xs font-medium text-rose-500 animate-fade-up" role="alert">
              {errors.budgetRange.message}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelStyles}>Message</label>
        <div className="relative">
          <textarea
            id="message"
            rows={4}
            placeholder="Tell us about your project timeline and goals…"
            className={`${getBaseInputStyles(!!errors.message, dirtyFields.message && !errors.message)} resize-none`}
            {...register('message', {
              required: 'Could you share a few details about your project?',
              minLength: { value: 10, message: 'Try adding a little more detail so we can best prepare.' },
              maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters.' },
            })}
          />
          {/* Aligned to the top right for textareas instead of center */}
          <div className="absolute right-3 top-3 pointer-events-none">
            {errors.message ? (
              <span className="animate-fade-up"><AlertCircle className="w-5 h-5 text-rose-400" strokeWidth={2} /></span>
            ) : dirtyFields.message ? (
              <span className="animate-fade-up"><CheckCircle className="w-5 h-5 text-emerald-400" strokeWidth={2} /></span>
            ) : null}
          </div>
        </div>
        <div className="min-h-[1.5rem] pt-1">
          {errors.message && (
            <span className="text-xs font-medium text-rose-500 animate-fade-up" role="alert">
              {errors.message.message}
            </span>
          )}
        </div>
      </div>

      {/* Server-side Error */}
      {serverError && (
        <div className="flex items-center p-3 mb-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl animate-fade-up" role="alert">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-rose-500" strokeWidth={2} /> 
          {serverError}
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full mt-2 px-6 py-3.5 flex items-center justify-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-white/80" strokeWidth={3} />
            Processing…
          </>
        ) : (
          'Send Message →'
        )}
      </button>
    </form>
  );
}