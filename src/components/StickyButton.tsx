import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function StickyButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden">
      <Link
        to="/pricing#quote-form"
        className="flex items-center space-x-2 bg-ocean-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-ocean-700 transition-all hover:scale-105"
      >
        <Calendar className="h-5 w-5" />
        <span className="font-medium">Check Availability</span>
      </Link>
    </div>
  );
}
