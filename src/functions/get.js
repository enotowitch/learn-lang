export default (itemName) => {
	return eval(localStorage.getItem(itemName))
}