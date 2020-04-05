export default function getInitials(fullName: string, separator = ' ') {
    let splitName = fullName.split(separator).slice(0, 2)
    let splitInitials = splitName.map(n => n.charAt(0))
    return splitInitials.join('')
}