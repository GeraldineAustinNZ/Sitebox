import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface QuoteFormProps {
  enquiryType?: string;
}

export function QuoteForm({ enquiryType = 'general' }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    delivery_address: '',
    start_date: '',
    estimated_duration: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: submitError } = await supabase
        .from('quote_enquiries')
        .insert([
          {
            ...formData,
            enquiry_type: enquiryType,
          },
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        delivery_address: '',
        start_date: '',
        estimated_duration: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to submit enquiry. Please try calling us instead.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="quote-form">
      {success && (
        <div className="bg-sage-50 border border-sage-300 text-sage-900 px-4 py-3 rounded-md">
          <p className="font-medium">Thank you for your enquiry!</p>
          <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-900 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="delivery_address" className="block text-sm font-medium text-charcoal-700 mb-1">
          Delivery Address *
        </label>
        <input
          type="text"
          id="delivery_address"
          required
          placeholder="e.g., 123 Wanaka Street, Wanaka"
          value={formData.delivery_address}
          onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-charcoal-700 mb-1">
            Preferred Start Date *
          </label>
          <input
            type="date"
            id="start_date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="estimated_duration" className="block text-sm font-medium text-charcoal-700 mb-1">
            Estimated Duration *
          </label>
          <select
            id="estimated_duration"
            required
            value={formData.estimated_duration}
            onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          >
            <option value="">Select duration...</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="3 weeks">3 weeks</option>
            <option value="4 weeks">4 weeks</option>
            <option value="5-8 weeks">5-8 weeks</option>
            <option value="9+ weeks">9+ weeks</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-1">
          Additional Information (Optional)
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ocean-600 text-white px-8 py-3 rounded-md font-medium hover:bg-ocean-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <span>Request a Quote</span>
        )}
      </button>

      <p className="text-xs text-charcoal-500 text-center">
        * Required fields. We'll respond within 24 hours.
      </p>
    </form>
  );
}
