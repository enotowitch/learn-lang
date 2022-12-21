export default function getCookie(name) {
	const regExp = new RegExp(`${name}=&.*?&`)
	return (
		document.cookie.match(regExp)[0].replace(name + "=", '').replace(/[&]/g, "")
	)
}