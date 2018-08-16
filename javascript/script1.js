let pokemonNamesArray=[];
let currentQuestion =1;
let pokemonToFindName;
let score =0;
let allPokemon ;

function noHyphens( value){
	console.log(value);
	if (/[-]/i.test(value.pokemon.name)){ // i is ignore case here
	
		return false;
	}
	return true;
}
$(function(){
//based on the user choice this function will get the type of pokemon
	$('.start-quizz').click(function(){
		
		$('#pokemonQuizz').addClass('hidden');

		let value = $('#pokemon-type').val();
		
		$('.findPokemon').removeClass('hidden')
		


		$.ajax({
			url: "https://pokeapi.co/api/v2/type/" + value,
			dataType:'json',
			type:'GET',
			success:function(data){
				// HACK SOLUTION 	but not using in this game
				//data.pokemon = data.pokemon.filter(noHyphens);
				//console.log("filtered list :", data.pokemon);
				// Out of 100+ pokemons we only need 9 pokemons
				allPokemon = data.pokemon;
				pick_9_Pokemons_from_list(allPokemon);
				
			}
		});

	
// Randomly pick 9 pokemons and store it in the pokemonArray so that we can give one pokemon 
// at a time to match and it continues until all 9 pokemons are done
	function pick_9_Pokemons_from_list(pokemon){

		for (let i = 0; i < 9;i++){
			getRandomPokemon(pokemon);
		}
		//selectRandomName();
	}

	function getRandomPokemon(pokemon){
		let index = [Math.floor(Math.random() *pokemon.length)];
			let randomName = pokemon[index].pokemon.name;
			// we do not our function to pick the name again 
			pokemon.splice(index,1);
			createPokemon(randomName);
			
			//pokemonNamesArray.push(randomName);
	}


	//This function will display user one pokemon at one time
	function selectRandomName(){
		console.log("pokemon names array",pokemonNamesArray.slice());//copy an array
		pokemonToFindIndex = [Math.floor(Math.random()*pokemonNamesArray.length)];
		pokemonToFindName = pokemonNamesArray[pokemonToFindIndex];
			
		if(pokemonToFindName == undefined ){
			$('.pokemonName').addClass('hidden')
			$('.wrapper').append("<div id=\"reset-next\"><button type=\"button\" id=\"resetQuizz\"> Replay </button><button type=\"button\" id=\"nextPage\"> Evolution Questions </button></div>");
			//$('.wrapper').append("<div><button type=\"button\" id=\"nextPage\"> Evolution Questions </button></div>");
			$('#resetQuizz').click(function(){
				document.location.reload(true);
			});
			//return;
			$('#nextPage').click(function(){
				 window.location.href = "test.html";

			});
			// to stop program from adding extra set of  Replay and Evolution Questions buttons
				//$('.pokemonImages li').attr('disabled', 'disabled');
				$(".pokemonImages li").click(function(e) {
				    e.preventDefault();
				    e.stopPropagation();
				    return false;
				});
		}
	

		$('.pokemonName').html('Find:'+ pokemonToFindName.toUpperCase());
		$('.score').removeClass('hidden');
	}

	function replacePokemon(name){
		//remove pokemon from list of names
		//if happens pick another name
		console.log("need to replace Pokemon",name);	
		getRandomPokemon(allPokemon);
		
	}

// This function will request pokemon api based on the names of 9 pokemon so that we can display
// the image of the pokemons. Also we have to make sure that the image is always displayed & not null

	function createPokemon(name){
		var myPromise =	$.ajax({ 
			url: "https://pokeapi.co/api/v2/pokemon/" +name,
			dataType:'json',
			type:"GET",
			//success: handlePokemonData

			/*success:function(data){
				console.log(data);
				let images = data.sprites.front_default;
				let name = data.name;
				if(!images){
					console.warn("image is missing", data);
					replacePokemon(name);
					return;
/* The following 2 lines doesn't work. All the sprites are null. Choosing different default image is not an option
						//images = data.sprites.front_shiny;
						//$('.shadow').append(images);
				}
				$('.result').append("<div class =\"pokemonImages\"><li><img class='shadow' id = "+name+" src =\""+images+"\"></li></div>");
				pokemonNamesArray.push(name);

				if(pokemonNamesArray.length ==9){
					selectRandomName();	
				}
			
			}*/
		}); 
console.log(myPromise);
myPromise.then(handlePokemonData);
//document.on('promiseResolved',handlePokemonData);

	}
 function handlePokemonData (data){
				console.log(data);
				let images = data.sprites.front_default;
				let name = data.name;
				if(!images){
					console.warn("image is missing", data);
					replacePokemon(name);
					return;
/* The following 2 lines doesn't work. All the sprites are null. Choosing different default image is not an option*/
						//images = data.sprites.front_shiny;
						//$('.shadow').append(images);
				}
				$('.result').append("<div class =\"pokemonImages\"><li><img class='shadow' id = "+name+" src =\""+images+"\"></li></div>");
				pokemonNamesArray.push(name);

				if(pokemonNamesArray.length ==9){
					selectRandomName();	
				}
	}

//This function will check if the user clicked on the correct image or not
	function checkForMatch(e){


		clickedImageId = $(this).find("img").attr("id");
						
		if(clickedImageId == pokemonToFindName){ 
			console.log("they match"); 
			score ++;
			$(this).removeClass("shadow");
			$(this).addClass("active");
			pokemonNamesArray.splice(pokemonToFindIndex,1);
		}
							
		$('.score').html("Score: "+ score);
		selectRandomName();
	}

	$('.result').on('click','.pokemonImages',checkForMatch);
		
	});
		
});
