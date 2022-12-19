export default function getCookie(name) {
	const regExp = new RegExp(`${name}={.*?}`)
	return (
		// todo now only for STRINGS => REDO for OBJECTS
		document.cookie.match(regExp)[0].replace(name + "=", '').replace(/[{};'"]/g, "")
	)
}