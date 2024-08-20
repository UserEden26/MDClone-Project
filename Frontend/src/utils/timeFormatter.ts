export function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    // Options for local date and time formatting
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour time format
    };

    // Format the date and time
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
        date
    );

    return formattedDate.replace(',', ''); // Remove the comma separating date and time
}
