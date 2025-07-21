export const features = [
    {
      icon: "🏆",
      title: "Sports Highlights",
      description: "Share and watch the best moments from university sports events"
    },
    {
      icon: "🎥",
      title: "Easy Video Upload",
      description: "Simple video upload process with automatic YouTube integration"
    },
    {
      icon: "🖼️",
      title: "Photo & Text Posts",
      description: "Post event photos or just text updates to share moments instantly"
    },
    {
      icon: "👥",
      title: "Community",
      description: "Connect with fellow students, athletes, and sports enthusiasts, everyone can join the fun."
    },
    {
      icon: "📱",
      title: "Responsive",
      description: "Access your favorite sports content on any device"
    }
];

export const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Basketball Captain",
      content: "UniSportX has revolutionized how we share our team's achievements. The platform is incredibly user-friendly!"
    },
    {
      name: "Mike Chen",
      role: "Soccer Player",
      content: "I love being able to watch highlights from other faculties. It really brings our university sports community together."
    },
    {
      name: "Emma Davis",
      role: "Sports Coordinator",
      content: "As a sports coordinator, UniSportX has made it so much easier to showcase our university's athletic talent."
    }
];
export const facultyOptions = [
  'Arts',
  'Basic Medical Science',
  'Clinical Science',
  'Dental Science',
  'Education',
  'Engineering',
  'Environmental Science',
  'Health Professions',
  'Law',
  'Management Science',
  'Pharmacy',
  'Science',
  'Social Science'
];


export const getFacultyColor = (faculty: string) => {
  const colors = {
    'Engineering': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Science': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Business': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Medicine': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Law': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };
  return colors[faculty as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};