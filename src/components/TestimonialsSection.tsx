import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Patient since 2023',
      comment: 'I used to have severe dental anxiety, but Lumina Dental completely changed my perspective. The staff is so gentle and professional, and the clinic feels more like a luxury spa!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Dr. Michael Chang',
      role: 'Patient since 2022',
      comment: 'As a physician, I am extremely particular about healthcare quality. Lumina Dental delivers world-class clinical precision with state-of-the-art equipment. Simply the best.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Emily Vance',
      role: 'Teeth Whitening Patient',
      comment: 'Got my laser teeth whitening done here before my wedding. The results were stunningly natural, and there was zero sensitivity. Highly recommend!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide uppercase">
            <span>Patient Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Thousands of Smiles
          </h2>
          <p className="text-lg text-slate-600">
            Read what our wonderful patients have to say about their experience at Lumina Dental.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 relative flex flex-col justify-between shadow-xs hover:shadow-md transition"
            >
              <div className="absolute top-6 right-8 text-teal-600/20">
                <Quote className="w-10 h-10" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-200/80 relative z-10">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-600"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
