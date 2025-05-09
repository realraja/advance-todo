export function getTimeDifferenceFromToday(inputDateStr) {
    const inputDate = new Date(inputDateStr);
    const today = new Date();
  
    // Set time to 0 for accurate comparison
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    let years = today.getFullYear() - inputDate.getFullYear();
    let months = today.getMonth() - inputDate.getMonth();
    let days = today.getDate() - inputDate.getDate();
  
    if (days < 0) {
      // Borrow days from previous month
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
  
    if (months < 0) {
      months += 12;
      years--;
    }
  
    return { years, months, days };
  }

export const formatDateDisplay = (dateString) => {
    if (!dateString) return { 
        text: 'Anytime', 
        shortText: 'Any', 
        color: 'bg-gray-600/20 text-gray-300',
        textColor: 'text-gray-300'
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));
    const dayOfWeek = taskDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const month = taskDate.getMonth();
    const date = taskDate.getDate();

    // Special dates (month/day)
    const isNewYear = month === 0 && date === 1;
    const isValentines = month === 1 && date === 14;
    const isChristmas = month === 11 && date === 25;
    const isHalloween = month === 9 && date === 31;
    const isIndependenceDayUS = month === 6 && date === 4;

    if (isNewYear) {
        return {
            text: 'New Year',
            shortText: '🎉 NY',
            color: 'bg-gradient-to-r from-yellow-400/20 to-gold-500/30',
            textColor: 'text-yellow-300 font-bold'
        };
    } else if (isChristmas) {
        return {
            text: 'Christmas',
            shortText: '🎄 Xmas',
            color: 'bg-gradient-to-r from-green-500/20 to-red-500/20',
            textColor: 'text-red-300 font-bold'
        };
    } else if (isValentines) {
        return {
            text: "Valentine's",
            shortText: '❤️ V-Day',
            color: 'bg-gradient-to-r from-pink-500/30 to-red-500/30',
            textColor: 'text-pink-300 font-bold'
        };
    } else if (isHalloween) {
        return {
            text: 'Halloween',
            shortText: '🎃 Oct 31',
            color: 'bg-gradient-to-r from-purple-500/20 to-orange-500/20',
            textColor: 'text-orange-300 font-bold'
        };
    } else if (isIndependenceDayUS) {
        return {
            text: 'July 4th',
            shortText: '🇺🇸 July 4',
            color: 'bg-gradient-to-r from-red-500/20 via-white/20 to-blue-500/20',
            textColor: 'text-blue-300 font-bold'
        };
    } else if (diffDays === 0) {
        return {
            text: 'Today',
            shortText: 'Today',
            color: 'bg-gradient-to-r from-red-500/30 to-pink-500/30',
            textColor: 'text-red-100 font-bold animate-pulse'
        };
    } else if (diffDays === 1) {
        return {
            text: 'Tomorrow',
            shortText: 'Tmrw',
            color: 'bg-gradient-to-r from-orange-500/30 to-amber-500/30',
            textColor: 'text-amber-100 font-semibold'
        };
    } else if (diffDays === 2) {
        return {
            text: 'In 2 Days',
            shortText: '2 Days',
            color: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
            textColor: 'text-amber-200'
        };
    } else if (diffDays === 3) {
        return {
            text: 'In 3 Days',
            shortText: '3 Days',
            color: 'bg-gradient-to-r from-lime-500/20 to-green-500/20',
            textColor: 'text-lime-200'
        };
    } else if (diffDays > 3 && diffDays <= 7) {
        return {
            text: `In ${diffDays} Days`,
            shortText: `${diffDays} Days`,
            color: isWeekend 
                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' 
                : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
            textColor: isWeekend ? 'text-blue-200' : 'text-emerald-200'
        };
    } else if (diffDays > 7 && diffDays <= 14) {
        return {
            text: `In ${diffDays} Days`,
            shortText: `${diffDays} Days`,
            color: 'bg-gradient-to-r from-cyan-500/20 to-sky-500/20',
            textColor: 'text-cyan-200'
        };
    } else if (diffDays > 14 && diffDays <= 30) {
        return {
            text: `In ${diffDays} Days`,
            shortText: `${diffDays} Days`,
            color: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20',
            textColor: 'text-violet-200'
        };
    } else if (diffDays > 30 && diffDays <= 60) {
        return {
            text: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            shortText: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            color: 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20',
            textColor: 'text-fuchsia-200'
        };
    } else {
        return {
            text: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            shortText: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            color: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
            textColor: 'text-gray-300'
        };
    }
};


   export const getDayDisplay = (dayString) => {
        if (!dayString || dayString.toLowerCase() === 'anytime') {
            return {
                text: 'Anytime',
                shortText: 'Any',
                isToday: false,
                isTomorrow: false
            };
        }

        const today = new Date();
        const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const inputDay = dayString.toLowerCase();

        if (inputDay === todayDayName) {
            return {
                text: 'Today',
                shortText: 'Today',
                isToday: true,
                isTomorrow: false
            };
        }

        if (inputDay === tomorrowDayName) {
            return {
                text: 'Tomorrow',
                shortText: 'Tmrw',
                isToday: false,
                isTomorrow: true
            };
        }

        return {
            text: `Do on: ${dayString}`,
            shortText: dayString.slice(0, 3),
            isToday: false,
            isTomorrow: false
        };
    };


  export  const getDayColor = (day, isToday = false, isTomorrow = false) => {
        const dayLower = day.toLowerCase();
    
        // Priority for Today/Tomorrow
        if (isToday) return 'bg-red-500/30 text-red-400 font-bold animate-pulse';
        if (isTomorrow) return 'bg-orange-500/30 text-orange-400 font-semibold';
    
        // Specific day colors
        switch (dayLower) {
            case 'sunday':
                return 'bg-red-500/20 text-red-400';
            case 'monday':
                return 'bg-blue-500/20 text-blue-400';
            case 'tuesday':
                return 'bg-purple-500/20 text-purple-400';
            case 'wednesday':
                return 'bg-green-500/20 text-green-400';
            case 'thursday':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'friday':
                return 'bg-indigo-500/20 text-indigo-400';
            case 'saturday':
                return 'bg-pink-500/20 text-pink-400';
            case 'anytime':
                return 'bg-gray-600/20 text-gray-300';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };