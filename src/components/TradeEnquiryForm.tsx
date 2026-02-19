import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export function TradeEnquiryForm() {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    estimated_weekly_needs: '',
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
        .from('trade_enquiries')
        .insert([formData]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({
        business_name: '',
        contact_name: '',
        phone: '',
        email: '',
        estimated_weekly_needs: '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-sage-50 border border-sage-300 text-sage-900 px-4 py-3 rounded-md">
          <p className="font-medium">Thank you for your trade account enquiry!</p>
          <p className="text-sm mt-1">We'll be in touch within 24 hours to discuss your needs.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-900 px-4 py-3 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-charcoal-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            id="business_name"
            required
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-charcoal-700 mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            id="contact_name"
            required
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div>
        <label htmlFor="estimated_weekly_needs" className="block text-sm font-medium text-charcoal-700 mb-1">
          How often do you need storage?
        </label>
        <select
          id="estimated_weekly_needs"
          value={formData.estimated_weekly_needs}
          onChange={(e) => setFormData({ ...formData, estimated_weekly_needs: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal-300 rounded-md focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        >
          <option value="">Select frequency...</option>
          <option value="Ongoing (4+ weeks)">Ongoing (4+ weeks)</option>
          <option value="Multiple projects per year">Multiple projects per year</option>
          <option value="Occasionally as needed">Occasionally as needed</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-700 mb-1">
          Tell us about your storage needs
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="e.g., Type of work, typical project duration, storage requirements..."
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
          <span>Apply for Trade Account</span>
        )}
      </button>

      <p className="text-xs text-charcoal-500 text-center">
        * Required fields. We'll respond within 24 hours to discuss your trade account.
      </p>
    </form>
  );
}
