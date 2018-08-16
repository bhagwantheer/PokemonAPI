let pokemonNamesArray=[];
let currentQuestion =1;
let pokemonToFindName;
let score =0;

$(function(){

//based on the user choice this function will get the type of pokemon
	$('.start-quizz').click(function(){
		let value = $('#pokemon-type').val();
		$.ajax({
			url: "https://pokeapi.co/api/v2/type/" + value,
			dataType:'json',
			type:'GET',
			success:function(data){
				// Out of 100+ pokemons we only need 9 pokemons
				getRandomPokemon(data);//filter
			}
		});

		// Randomly pick 9 pokemons and store it in the pokemonArray so that we can give one pokemon 
		// at a time to match and it continues until all 9 pokemons are done
		function getRandomPokemon(data){
			for (let i = 0; i < 9;i++){
					let index = [Math.floor(Math.random() *data.pokemon.length)];
					let randomName = data.pokemon[index].pokemon.name;
				    // we do not our function to pick the name again 
				    data.pokemon.splice(index,1);
				    createPokemon(randomName);
				    pokemonNamesArray.push(randomName);
			}
			selectRandomName();
		}

		//This function will display user one pokemon at one time
		function selectRandomName(){
			let pokemonToFindIndex = [Math.floor(Math.random()*pokemonNamesArray.length)];
			pokemonToFindNames = pokemonNamesArray[pokemonToFindIndex];
			// we do not want our function to pick the same name again 
			
			if(pokemonToFindName == undefined){
				$('#pokemonQuizz').append("<div><button type=\"button\" id=\"nextPageButton\">Next Page </button></div>");
				return;
			}
			$('#pokemonName').html('Find:'+ pokemonToFindName );
		}
		
		// This function will request pokemon api based on the names of 9 pokemon so that we can display
		// the image of the pokemons. Also we have to make sure that the image is always displayed &not null
		function createPokemon(name){
			$.ajax({
				url: "https://pokeapi.co/api/v2/pokemon/" +name,
				dataType:'json',
				type:"GET",
				success:function(data){
					console.log(data);
					let images = data.sprites.front_default;
					let name = data.name;
					//if($('.shadow img').attr("src")== "null"){
					//	getRandomPokemon();
					//}
					if(!images){
						console.log("image is missing", data);
/* The following 2 lines doesn't work. All the sprites are null. Choosing different default is not an option*/
						//images = data.sprites.front_shiny;
						//$('.shadow').append(images);
						
						}

					$('.result').append("<div class =\"pokemonImages\"><li><img class='shadow' id = "+name+" src =\""+images+"\"></li></div>");
					
					//$('.result div').on('click',checkForMatch);
				}

			});
		}

//This function will check if the user clicked on the correct image or not
		function checkForMatch(){
				clickedImageId = $(this).find("img").attr("id");
				console.log(clickedImageId);
				
					if(clickedImageId == pokemonToFindNames){
						console.log("they match"); 
						score ++;
						$(this).removeClass("shadow");
						$(this).addClass("active");
						pokemonNamesArray.splice(pokemonToFindIndex,1);
					}

					$('#score').html("Score: "+ score);
					selectRandomName();
			
		}


		function nextSetofQuestions(){
		$('#nextPageButton').on('click','eventhandler',addNextSetofQuestions);
		}


		function addNextSetofQuestions(event){
			console.log(event);
			console.log('you clicked next button');
			//$('#questionsClass').text(questions[currentQuestion]);

		}

	$('.result').on('click','.pokemonImages',checkForMatch);

	});
		
});

