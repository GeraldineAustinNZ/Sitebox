import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export function StickyButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gradient-to-t from-white via-white to-transparent pt-4 pb-safe">
      <div className="px-4 pb-4">
        <Link
          to="/pricing#quote-form"
          className="flex items-center justify-center space-x-2 w-full bg-ocean-600 text-white px-6 py-3 min-h-[48px] rounded-lg shadow-lg hover:bg-ocean-700 transition-all active:scale-95"
        >
          <Calendar className="h-5 w-5" />
          <span className="font-medium text-base">Check Availability</span>
        </Link>
      </div>
    </div>
  );
}
