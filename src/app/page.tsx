import DashboardCard from '@/components/dashboard/DashboardCard';
import RecommendationList from '@/components/dashboard/RecommendationList';
import ReminderList from '@/components/dashboard/ReminderList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Sample data for demonstration
const sampleRecommendations = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    type: 'lesson',
    description: 'Learn the basics of machine learning algorithms',
  },
  {
    id: '2',
    title: 'JavaScript Quiz',
    type: 'quiz',
    description: 'Test your knowledge of JavaScript fundamentals',
  },
  {
    id: '3',
    title: 'Effective Time Management',
    type: 'soft-skill',
    description: 'Techniques to improve your productivity',
  },
] as const;

const sampleReminders = [
  {
    id: '1',
    title: 'Complete Python Assignment',
    datetime: '2023-06-15T14:00:00',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Review React Hooks',
    datetime: '2023-06-16T10:00:00',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Practice Typing',
    datetime: '2023-06-17T09:00:00',
    priority: 'low',
  },
] as const;

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome, Student
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Computer Science • Visual Learner
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-lg">
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search for topics, lessons, or questions..."
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recommendations */}
        <DashboardCard title="Recommended for You">
          <RecommendationList recommendations={sampleRecommendations} />
        </DashboardCard>

        {/* Reminders */}
        <DashboardCard title="Learning Reminders">
          <ReminderList reminders={sampleReminders} />
        </DashboardCard>

        {/* Quick Stats */}
        <DashboardCard title="Learning Progress">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Python Basics</p>
                <p className="text-sm font-medium text-indigo-600">75%</p>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Web Development</p>
                <p className="text-sm font-medium text-indigo-600">45%</p>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Data Structures</p>
                <p className="text-sm font-medium text-indigo-600">30%</p>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity">
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">Completed <span className="font-medium text-gray-900">JavaScript Basics Quiz</span></p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime="2023-06-14T13:00:00">1 day ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">Started <span className="font-medium text-gray-900">React Fundamentals</span> lesson</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime="2023-06-13T10:00:00">2 days ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">Asked a question about <span className="font-medium text-gray-900">Python Lists</span></p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime="2023-06-12T15:30:00">3 days ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
