<? 
$webPage = file_get_contents("https://dictionary.cambridge.org/ru/%D1%81%D0%BB%D0%BE%D0%B2%D0%B0%D1%80%D1%8C/%D0%B0%D0%BD%D0%B3%D0%BB%D0%BE-%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9/nail");
echo $webPage;


// USE LATER:

			// fetch('read.php')
			// 	.then((response) => {
			// 		return response.text();
			// 	})
			// 	.then((data) => {
			// 		const translation = data.match(/trans dtrans dtrans-se " lang="ru">[а-яА-Я\s,-]*/gm)
			// 		document.querySelector('body').append(translation)
			// 		console.log(translation)
			// 	});