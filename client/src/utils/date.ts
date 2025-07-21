export const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 30) return `${diffInDays}d ago`;

    // Calculate months and years accurately
    const years = now.getFullYear() - date.getFullYear();
    let months = now.getMonth() - date.getMonth() + years * 12;
    if (now.getDate() < date.getDate()) {
      months--;
    }
    if (months < 12) return `${months}mo ago`;

    // For years, check if the current month/day is before the date's month/day
    let yearDiff = years;
    if (
      now.getMonth() < date.getMonth() ||
      (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())
    ) {
      yearDiff--;
    }
    console.log(diffInHours)
    return `${yearDiff}y ago`;
    // return date.toLocaleDateString();
  };