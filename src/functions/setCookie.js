export default function setCookie(name, value) {
	return (
		document.cookie = `${name}=&${value}&`
	)
}