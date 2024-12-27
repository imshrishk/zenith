import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const PREDEFINED_QUESTIONS = [
  {
    id: 1,
    category: "Getting Started",
    question: "What is the actual meaning of meditation?",
    answer: "To be beyond the mind is known as meditation.",
  },
  {
    id: 2,
    category: "Techniques",
    question: "Is there any specific method for meditation?",
    answer: "There are many methods of meditation. Traditionally there were 108 methods suggested.",
  },
  {
    id: 3,
    category: "Benefits",
    question: "What are the benefits of meditation?",
    answer: "Meditation is for better mental and physical health. Additionally, you get peace of mind and spiritual progress.",
  },
  {
    id: 4,
    category: "",
    question: "Can you get supernatural powers by practice of meditation?",
    answer: "Yes, but for that specific method of meditation required.",
  },
  {
    id: 5,
    category: "",
    question: "Is there any loss from meditation?",
    answer: "You will lose greed, anger, anxiety and some desires too.",
  },
  {
    id: 6,
    category: "",
    question: "Is there any alternative of meditation?",
    answer: "Permanent solution is only meditation but temporary there are many alternatives.",
  },
  {
    id: 7,
    category: "",
    question: "From where to learn meditation?",
    answer: "From any learnt guru.",
  },
  {
    id: 8,
    category: "",
    question: "What happens during meditation?",
    answer: "You can see white light, images and a sensation full of ultimate pleasure. Experienced meditators can even see the spirit of themselves.",
  },
  {
    id: 9,
    category: "",
    question: "What should be the daily duration of meditation?",
    answer: "Minimum 15 minutes and there is no limit for maximum duration.",
  },
  {
    id: 10,
    category: "",
    question: "Can anyone do meditation?",
    answer: "Yes, everyone can do it.",
  },
  {
    id: 11,
    category: "",
    question: "How many days are required to see the evidence-based proof for benefits of meditation?",
    answer: "It varies from person to person and also depends upon method of meditation.",
  },
  {
    id: 12,
    category: "",
    question: "Is there any quicker method of meditation?",
    answer: "Dynamic and dark meditation are the quicker methods of meditation.",
  },
  {
    id: 13,
    category: "",
    question: "Why should I do the meditation?",
    answer: "To get better and spiritual life.",
  },
  {
    id: 14,
    category: "",
    question: "What is the difference between yoga and meditation?",
    answer: "To control desires, emotions etc. by specific methods are known as yoga but meditation takes you beyond the mind.",
  },
  {
    id: 15,
    category: "",
    question: "Between yoga and meditation which is the better?",
    answer: "Yoga is the first step towards meditation. So, both are necessary.",
  },
  {
    id: 16,
    category: "",
    question: "Why Meditation?",
    answer: "To be in harmony with nature. To be peaceful",
  },
  {
    id: 17,
    category: "",
    question: "What is Meditation?",
    answer: "To be out of control of mind is meditation.",
  },
  {
    id: 18,
    category: "",
    question: "How to be in meditation?",
    answer: "By witnessing the thought. By being choiceless aware. By accepting present condition in totality. By being fully involved in present activity. By total surrender to nature.",
  },
  {
    id: 19,
    category: "",
    question: "How to reduce thought?",
    answer: "By doing pranayama.	To be in Dhyan.",
  },
  {
    id: 20,
    category: "",
    question: "What is Pranayam?",
    answer: "Pranayam is special technique of breathing.	Number of thoughts depends upon breathing rate.	Less thoughts lead to better control of mind.",
  },
  {
    id: 21,
    category: "",
    question: "What are major components of Pranayam? ",
    answer: "Inhale, hold and exhale of breaths.",
  },
  {
    id: 22,
    category: "",
    question: "How to do Dhyan?",
    answer: "To be in Dhyan by means of Tratak. By focussing on in and out breathing and observing the interval between them.",
  }
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(PREDEFINED_QUESTIONS.map(q => q.category))];

  const filteredQuestions = PREDEFINED_QUESTIONS.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-indigo-600 font-medium">{item.category}</span>
                  <h3 className="text-lg font-semibold mt-1">{item.question}</h3>
                </div>
                {expandedId === item.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            {expandedId === item.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { FAQPage };