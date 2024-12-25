import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const PREDEFINED_QUESTIONS = [
  {
    id: 1,
    category: "Getting Started",
    question: "What is meditation and how do I begin?",
    answer: "Meditation is a practice of focused attention that helps calm the mind and reduce stress. To begin, find a quiet space, sit comfortably, and focus on your breath for 5-10 minutes daily.",
  },
  {
    id: 2,
    category: "Techniques",
    question: "What are the different types of meditation?",
    answer: "Common types include mindfulness meditation (observing thoughts without judgment), transcendental meditation (using mantras), loving-kindness meditation (cultivating compassion), and body scan meditation (progressive relaxation).",
  },
  {
    id: 3,
    category: "Benefits",
    question: "What are the scientifically proven benefits of meditation?",
    answer: "Research has shown meditation can reduce stress and anxiety, improve focus and concentration, enhance emotional well-being, lower blood pressure, and potentially help with pain management and sleep quality.",
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