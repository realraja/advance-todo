

export const formatDateDisplay = (dateString) => {
    if (!dateString) return { text: 'Anytime', shortText: 'Any', color: 'bg-gray-600/20 text-gray-300' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return {
            text: 'Today',
            shortText: 'Today',
            color: 'bg-red-500/30 text-red-400 font-bold animate-pulse'
        };
    } else if (diffDays === 1) {
        return {
            text: 'Tomorrow',
            shortText: 'Tmrw',
            color: 'bg-orange-500/30 text-orange-400 font-semibold'
        };
    } else if (diffDays > 1 && diffDays <= 10) {
        return {
            text: diffDays + ' Days Later',
            shortText: diffDays + ' Days',
            color: 'bg-rose-500/10 text-rose-400'
        };
    } else if (diffDays > 10 && diffDays <= 99) {
        return {
            text: diffDays + ' Days Later',
            shortText: diffDays + ' Days',
            color: 'bg-indigo-500/10 text-indigo-400'
        };
    } else {
        const formattedDate = taskDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        return {
            text: formattedDate,
            shortText: formattedDate,
            color: 'bg-gray-500/20 text-gray-400'
        };
    }
};