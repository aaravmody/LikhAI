import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/outline';
import Navbar from '../components/Navbar';

// Pre-loaded tutorials data
const TUTORIALS = [
    {
        id: 1,
        type: 'video',
        title: 'The Art of Creative Writing',
        description: 'Learn the fundamentals of creative writing and storytelling techniques.',
        thumbnail: 'https://i.ibb.co/VvC0vpN/creative-writing.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=YZxaJ1LUqjQ',
        category: 'Creative Writing'
    },
    {
        id: 2,
        type: 'article',
        title: 'How to Write Compelling Characters',
        description: 'Master the art of creating memorable and relatable characters in your stories.',
        url: 'https://blog.reedsy.com/guide/character-development/',
        image: 'https://i.ibb.co/M6ZYWSK/characters.jpg',
        category: 'Character Development'
    },
    {
        id: 3,
        type: 'video',
        title: 'Writing Better Dialogue',
        description: 'Tips and techniques for crafting natural and engaging dialogue.',
        thumbnail: 'https://i.ibb.co/Xy6Y2Yy/dialogue.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=DkwcHNDjvYo',
        category: 'Dialogue'
    },
    {
        id: 4,
        type: 'article',
        title: 'World Building Essentials',
        description: 'Create immersive and believable worlds for your stories.',
        url: 'https://blog.reedsy.com/guide/worldbuilding/',
        image: 'https://i.ibb.co/VxFyKZF/worldbuilding.jpg',
        category: 'World Building'
    },
    {
        id: 5,
        type: 'video',
        title: 'Writing Effective Story Endings',
        description: 'Learn how to craft satisfying and memorable endings.',
        thumbnail: 'https://i.ibb.co/0MZ6Pxg/story-endings.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=0F-ok6AGYtc',
        category: 'Story Structure'
    },
    {
        id: 6,
        type: 'video',
        title: 'Mastering Story Structure',
        description: 'Understanding the key elements of story structure and plot development.',
        thumbnail: 'https://i.ibb.co/xGV2Lz4/story-structure.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=urJDb3E5P1U',
        category: 'Story Structure'
    },
    {
        id: 7,
        type: 'article',
        title: 'Writing Effective Description',
        description: 'Learn how to paint vivid pictures with words and engage your readers.',
        url: 'https://blog.reedsy.com/show-dont-tell/',
        image: 'https://i.ibb.co/VpNJgZR/description.jpg',
        category: 'Description'
    },
    {
        id: 8,
        type: 'video',
        title: 'Creating Conflict in Your Story',
        description: 'Learn how to create and maintain tension in your writing.',
        thumbnail: 'https://i.ibb.co/wSRtRJZ/conflict.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=RNCuR8QQh_4',
        category: 'Plot Development'
    },
    {
        id: 9,
        type: 'article',
        title: 'Writing Authentic Emotions',
        description: 'Tips for conveying genuine emotions in your characters.',
        url: 'https://blog.reedsy.com/guide/character-development/character-emotions/',
        image: 'https://i.ibb.co/0jX1Lqy/emotions.jpg',
        category: 'Character Development'
    },
    {
        id: 10,
        type: 'video',
        title: 'World-Building Techniques',
        description: 'Advanced strategies for creating rich and believable fictional worlds.',
        thumbnail: 'https://i.ibb.co/FXyXPz6/world-building.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=2XpbcDvxVXA',
        category: 'World Building'
    },
    {
        id: 11,
        type: 'article',
        title: 'Writing Effective Action Scenes',
        description: 'Learn how to write dynamic and engaging action sequences.',
        url: 'https://blog.reedsy.com/guide/action-scenes/',
        image: 'https://i.ibb.co/qyCxYz0/action-scenes.jpg',
        category: 'Scene Writing'
    },
    {
        id: 12,
        type: 'video',
        title: 'Character Arc Development',
        description: 'Understanding how to create meaningful character growth.',
        thumbnail: 'https://i.ibb.co/Kj0Y8Yb/character-arc.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=w1JbkGFVsaA',
        category: 'Character Development'
    },
    {
        id: 13,
        type: 'article',
        title: 'Writing Romance Subplots',
        description: 'Tips for weaving romantic elements into your story.',
        url: 'https://blog.reedsy.com/guide/romance-writing/',
        image: 'https://i.ibb.co/VTyPgzF/romance.jpg',
        category: 'Genre Writing'
    },
    {
        id: 14,
        type: 'video',
        title: 'Pacing Your Story',
        description: 'Learn how to control the rhythm and flow of your narrative.',
        thumbnail: 'https://i.ibb.co/xf6WSHM/pacing.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=1OHk1R8z-_Y',
        category: 'Story Structure'
    },
    {
        id: 15,
        type: 'article',
        title: 'Writing Effective Dialogue Tags',
        description: 'Master the art of dialogue attribution and beats.',
        url: 'https://blog.reedsy.com/guide/dialogue/',
        image: 'https://i.ibb.co/Lp9tY4Y/dialogue-tags.jpg',
        category: 'Dialogue'
    }
];

const Tutorials = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    const categories = ['all', ...new Set(TUTORIALS.map(tutorial => tutorial.category))];

    const filteredTutorials = TUTORIALS.filter(tutorial => {
        const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Writing Tutorials
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-300"
                    >
                        Enhance your writing skills with our curated collection of tutorials
                    </motion.p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                                    selectedCategory === category
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tutorials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTutorials.map(tutorial => (
                        <motion.div
                            key={tutorial.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedTutorial(tutorial)}
                        >
                            <div className="relative pb-[56.25%]">
                                <img
                                    src={tutorial.type === 'video' ? tutorial.thumbnail : tutorial.image}
                                    alt={tutorial.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                                    {tutorial.type === 'video' ? 'Video' : 'Article'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {tutorial.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                    {tutorial.description}
                                </p>
                                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                                    <BookOpenIcon className="h-4 w-4 mr-1" />
                                    {tutorial.category}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tutorial Modal */}
                {selectedTutorial && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {selectedTutorial.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedTutorial(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                {selectedTutorial.type === 'video' ? (
                                    <div className="space-y-4">
                                        <img
                                            src={selectedTutorial.thumbnail}
                                            alt={selectedTutorial.title}
                                            className="w-full rounded-lg"
                                        />
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {selectedTutorial.description}
                                        </p>
                                        <a
                                            href={selectedTutorial.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Watch on YouTube
                                        </a>
                                    </div>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <img
                                            src={selectedTutorial.image}
                                            alt={selectedTutorial.title}
                                            className="w-full rounded-lg mb-4"
                                        />
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {selectedTutorial.description}
                                        </p>
                                        <a
                                            href={selectedTutorial.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Read Full Article
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tutorials; 