import { ELLUAgent } from '@/components/ELLUAgent';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            ELLU Studios
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Fashion Education & Pattern Making Excellence
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            AI Course Concierge
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized course recommendations, compare learning paths, 
            and schedule consultations with our AI-powered concierge.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="h-[600px]">
          <ELLUAgent />
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Personalized Recommendations
            </h3>
            <p className="text-gray-600 text-sm">
              Get course suggestions tailored to your experience level and goals
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Learning Journeys
            </h3>
            <p className="text-gray-600 text-sm">
              Choose from 4 specialized paths: Beginner, Advanced, Sustainable, or Digital
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Expert Consultations
            </h3>
            <p className="text-gray-600 text-sm">
              Schedule free 30-minute consultations with our pattern making experts
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2024 ELLU Studios. Fashion education with AI-powered guidance.</p>
        </div>
      </footer>
    </div>
  );
}