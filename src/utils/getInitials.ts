export default function getInitials(fullName: string) {
    let splitName = fullName.split(' ').slice(0, 2)
    let splitInitials = splitName.map(n => n.charAt(0))
    return splitInitials.join('')
}