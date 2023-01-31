export default (itemName, itemValue) => {
	localStorage.setItem(itemName, JSON.stringify(itemValue))
}