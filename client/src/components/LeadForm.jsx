import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitLead } from '../../services/leadService';
import styles from './LeadForm.module.css';

const BUDGET_OPTIONS = [
  { value: '',       label: 'Select budget range…' },
  { value: '<1k',    label: 'Under $1,000' },
  { value: '1k-5k',  label: '$1,000 – $5,000' },
  { value: '5k-10k', label: '$5,000 – $10,000' },
  { value: '>10k',   label: 'Above $10,000' },
];

export default function LeadForm() {
  const [serverError, setServerError] = useState('');
  const [submitted,   setSubmitted]   = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await submitLead(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setServerError(msg);
    }
  };

  if (submitted) {
    return (
      <div className={styles.success} role="alert">
        <span className={styles.successIcon}>✓</span>
        <h3>Message received!</h3>
        <p>We'll be in touch within 1–2 business days.</p>
        <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Name */}
      <div className={styles.field}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="Jane Smith"
          className={errors.name ? styles.inputError : ''}
          {...register('name', {
            required:  'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
          })}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="jane@example.com"
          className={errors.email ? styles.inputError : ''}
          {...register('email', {
            required: 'Email is required',
            pattern:  { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
          })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      {/* Budget Range */}
      <div className={styles.field}>
        <label htmlFor="budgetRange">Budget Range</label>
        <select
          id="budgetRange"
          className={errors.budgetRange ? styles.inputError : ''}
          {...register('budgetRange', { required: 'Please select a budget range' })}
        >
          {BUDGET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} disabled={!o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.budgetRange && <span className={styles.error}>{errors.budgetRange.message}</span>}
      </div>

      {/* Message */}
      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Tell us about your project…"
          className={errors.message ? styles.inputError : ''}
          {...register('message', {
            required:  'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
            maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' },
          })}
        />
        {errors.message && <span className={styles.error}>{errors.message.message}</span>}
      </div>

      {/* Server-side error */}
      {serverError && (
        <div className={styles.serverError} role="alert">{serverError}</div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  );
}
