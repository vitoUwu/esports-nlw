export function convertHourStringToMinutes(string: string) {
	const [hours, minutes] = string.split(":").map(Number)

	return hours * 60 + minutes;
}