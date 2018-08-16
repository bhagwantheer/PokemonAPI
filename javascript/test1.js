$(function(){

		selectRandomPokemonToEvolve();
	
});


let pokemon_Ids_Array=[];
let pokemon_id , answerCount , loaded, totalNumberofQuestions = 0;
let evolveSpeciesName, score=0;
let pokemonNamesArray =[];
let correctPokemonImagesArray =[];// to collect all images -- random plus the correct evolution one


function getRandomNumber(){
	 return Math.floor(Math.random() *100) + 1;
}
//This function will give us 5 random ids of pokemons for questions
//Also I want this function to run only once 
function selectRandomPokemonToEvolve(){
	answerCount = 5;
	loaded = 0;

	for( let index = 1; index <= answerCount ; index ++){
		pokemon_id = getRandomNumber();//Math.floor(Math.random() *100) + 1;
		
		// to pick the unique id's, used if condition to check
		//if pokemon_id is not in the list then add it to the array
		if(pokemon_Ids_Array.indexOf(pokemon_id) == -1 ){
			pokemon_Ids_Array.push(pokemon_id);
			calltoEvolutionChainUrl(pokemon_id);
		}
		console.log("pokemon_Ids_Array ", pokemon_Ids_Array);

	} 

}


function replacePokemon(valueTobeReplaced){
	
	let newValue = getRandomNumber();//Math.floor(Math.random() *100);
    console.log("replacing: ", valueTobeReplaced, "with:" , newValue);

	pokemon_Ids_Array.forEach(function(item,index){
		console.log(index, " --->", item);
		if( item == valueTobeReplaced){
			console.log("inside if item is:",item,valueTobeReplaced);
			pokemon_Ids_Array.splice(index, 1, newValue);
			console.log("array with replaced pokemon is: ", pokemon_Ids_Array);
			calltoEvolutionChainUrl(newValue);
		}
	});

	/*// at index replace 1 element and insert newValue
	pokemon_Ids_Array.splice(index, 1, newValue);
	pokemon_Ids_Array[index] = newValue;
	console.log("array with replaced pokemon is: ", pokemon_Ids_Array);
	calltoEvolutionChainUrl(newValue);*/
}


// This function doesn't work properly, when called it inserts the images of all 5 correct pokemons
// plus the random ones are also there
 function insertCorrectImage(name){
 	$.ajax({
			url: "https://pokeapi.co/api/v2/pokemon/" + name ,
			dataType:'json',
			type:"GET",
			success:function(data){
				console.log("correct images data",data);
				let img = data.sprites.front_default;
				//this is adding 5 images  
				correctPokemonImagesArray.push(img);
				$('.randomChoice-images').append("<label><input type=\"radio\" id=\""+data.name+"\"class=\"radioBtnsClass \" name=\"pokeEvolutionChoices\" value="+img+"><img src=\""+img+"\"></label>");
			
			}
		});
 	// empty out the array after each call 
 		correctPokemonImagesArray = [];
 	}



 function calltoEvolutionChainUrl(id){
	$.ajax({
			url: "https://pokeapi.co/api/v2/evolution-chain/" + id ,
			dataType:'json',
			type:"GET",
			success:function(data){
				
				console.log("evolution chain",data);

				if(data.chain.evolves_to == undefined || data.chain.evolves_to == 0 ){
					var id = data.id;
					console.log("id of pokemon to replace is: ",id);
					replacePokemon(id); 
					return;
				}
				
				console.log("what does",data.chain.species.name,"evolve into");
				pokemonNamesArray.push(data.chain.species.name);
				
				loaded ++;

				if(loaded == answerCount){

					//call the function to put the image on the web page
					getPokemonToEvolveImage(data.chain.species.name);
				}

				$.each(data.chain.evolves_to,function(i,value){
					console.log("can evolve into :",value.species.name);
					//selectRandomPokemonOptions();
					evolveSpeciesName =  value.species.name;
					//insertCorrectImage(evolveSpeciesName);
				});

				insertCorrectImage(evolveSpeciesName);
			}
	});

}


//This function will get the image of the pokemon to evolve and displays the first question on the page
 function getPokemonToEvolveImage(pokemonName){
 	$.ajax({
			url: "https://pokeapi.co/api/v2/pokemon/" + pokemonName ,
			dataType:'json',
			type:"GET",
			success:function(data){
				console.log(data);
					let img = data.sprites.front_default;
					$('.questionHeading').append("<h2> What does  "+pokemonName.toUpperCase()+" evolve into ?</h2");
					$('.pokemonToEvolve').append("<img src=\""+img+"\">");
					
			}
		});
 		selectRandomPokemonOptions();
 }


function selectRandomPokemonOptions(){
	let id_forRandomPokemon = getRandomNumber();// Math.floor(Math.random() *100);
	//make sure this function doesn't pass the same id otherwise we will have same pokemon images
	//in our options....
	// we will create an array and make sure it's unique
	
		if(correctPokemonImagesArray.indexOf(id_forRandomPokemon)== -1){
			correctPokemonImagesArray.push(id_forRandomPokemon);
			console.log("check this",correctPokemonImagesArray);
			getRandomPokemonImages(id_forRandomPokemon );
		}	
		
}


 //function to get Random images of 3 pokemons
 function getRandomPokemonImages(randomPokemon){
 		$.ajax({
			url: "https://pokeapi.co/api/v2/pokemon/" + randomPokemon ,
			dataType:'json',
			type:"GET",
			success:function(data){
				console.log(data);

				let img = data.sprites.front_default;
				//correctPokemonImagesArray.push(img);
				//console.log("images array ", correctPokemonImagesArray);
														//associate with label and input
				$('.randomChoice-images').append("<label  for=\""+data.name+"\"><input type=\"radio\" id=\""+data.name+"\" class=\"radioBtnsClass \" name=\"pokeEvolutionChoices\" value="+img+"><img src=\""+img+"\"></label>");

			}
		});		
 		$('.wrapper').append("<div><input type=\"button\" id=\"checkbtn\" value=\"Next Question\"></div>");
		checkForCorrectAnswer();
	}


	function checkForCorrectAnswer(){
		$('#checkbtn').click(function(){
			let userAnswer = $("input[name='pokeEvolutionChoices']:checked").attr('id');
			console.log(userAnswer);
			if(userAnswer == evolveSpeciesName){
				console.log("they match");
				score++;
				}
			else{
				console.log("they do not match");
				
			}
			displayNextQuestion();
			
			// move function is used for progress bar
			move();

		});
	}


  function displayNextQuestion(){
		console.log(" let's display next question");
		console.log("loaded value= ",loaded, "answerCount value = ", answerCount );
		
		totalNumberofQuestions ++;
		console.log("totalNumberofQuestions: ",totalNumberofQuestions);
		// if quiz is finished
		// quiz is over
		// empty out the screen
		// display quiz over 
		if(totalNumberofQuestions > 2){
			
			endOfQuizz();
			return;
			//$('.wrapper').append("<h1> Quizz is over </h1>");
			//return;
		}

		if(loaded >=0){
			$('.pokemonToEvolve img').remove();
			$('.randomChoice-images label').remove();
			$('.questionHeading h2').remove();
			$('#checkbtn').remove();
			selectRandomPokemonToEvolve();
		}

	}


function move(){
	$('progress').prop("value",totalNumberofQuestions);
}


function endOfQuizz(){
	$('.wrapper').remove();
	$('.container').append("<div class =\" endofQuizz \"> ");
	$('.endofQuizz').append("<h2> You Guessed </h2>",score,"<h2> Out of 10 Pokemons</h2> ");
}