export function truncateString(string: string, length: number) {
    if (string && string.length > length) {
        return string.slice(0, length) + '...';
    }
    return string;
}

export function calculateAge(dateOfBirth: string) {
    // Parse the date of birth to a Date object
    const dob = new Date(dateOfBirth);
    // Get the current date
    const currentDate = new Date();
    // Calculate the difference in milliseconds between the current date and the date of birth
    let age = currentDate.getFullYear() - dob.getFullYear();

    // Check if the current date hasn't reached the birth month and day
    if (currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

