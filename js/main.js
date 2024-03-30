
$(document).ready(function () {
  let url = 'https://pokeapi.co/api/v2/pokemon';
  GetPokemon(url);
  $('.carousel').carousel()

});

async function GetPokemon(url) {
  $('#pokemonCard').html('');
  $('#pokemonCard').append(`
      <div class="text-center text-white">
        <div class="spinner-border text-white d-flex justify-content-center" role="status">
          <span class="sr-only text-white"></span>
        </div>
      </div>
    `);

  try {
    const response = await $.get(url, "json");
    console.log(response);
    $('#pokemonCard').html('');

    response.results.forEach((item) => {
      $.get(item.url, function (data) {
        $('#pokemonCard').append(`
            <div class="cursor-pointer card-pokemon col-6 col-xl-3 col-md-3 col-sm-3 col-lg-3 row align-items-center justify-content-center" data-id="${data.id}">
              <div class="col-12 d-flex align-items-center justify-content-center">
                <img src="${data.sprites.other.dream_world.front_default}" width="80px" height="80px" style="max-height:70px; min-height:60px"> 
              </div>
              <div class="col-12 d-flex justify-content-center align-items-center">
                <span class="text-white text-capitalize">${data.name} - ${data.order}</span>
              </div>
            </div>
          `);
      }, "json");
    });

    if (response.next) {
      $('#pagination').html(`
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end">
             <li class="page-item">
                <a class="page-link" href="#" tabindex="-1" id="previousClick" data-next="${response.previous}">Anterior</a>
             </li>
              <li class="page-item">
                <a class="page-link" href="#" id="nextClick" data-next="${response.next}">Siguiente</a>
              </li>
            </ul>
          </nav>
        `);
    } else {
      $('#pagination').html(`
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end">
              <li class="page-item disabled">
                <a class="page-link" href="#">Next (Last Page)</a>
              </li>
            </ul>
          </nav>
        `);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
$(document).on('click', '#nextClick', function () {
  GetPokemon($(this).attr('data-next'));
});

$(document).on('click', '#previousClick', function () {
  GetPokemon($(this).attr('data-next'));
});


$(document).on('click', '.card-pokemon', function () {
  $('#contentPokemon').html('')
  $('#exampleModalCenter').modal('show');
  let id = $(this).attr('data-id');
  $.get(`https://pokeapi.co/api/v2/pokemon/${id}`, function (data) {
    let statsHtml = '';
    let typesHtml = '';

    data.stats.forEach((item) => {
      statsHtml += `<div class="col-12 row">
                      <div class="col-2">
                            <span class="text-uppercase fw-bold">${GetNameStat(item.stat.name)}</span>
                      </div>
                      <div class="row align-items-center justify-content-center col-9">
                        <div class="progress col-9">
                          <div class="progress-bar bg-info" role="progressbar" style="width: ${item.base_stat}%" aria-valuenow="${item.base_stat}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="col-1">
                        <span class="fw-bold">${item.base_stat}%</span>
                        </div>
                      </div>
                    </div>

                      `;

    });
    data.types.forEach((item) => {
      typesHtml += `
      <div class="text-white">
        <span>${item.type.name}</span>
      </div>`
    })
    $('#contentPokemon').append(`

    <div class="col-12 d-flex align-items-center justify-content-center">
    <span class="fw-bold text-white text-capitalize">${data.name}</span>
</div>
      ${typesHtml}
<div>
<span><span>
</div>
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner ">
    <div class="carousel-item  row justify-content-center">
    <img src="${data.sprites.front_default}"  height="200px" style="max-height:200px; min-height:200px;">
    </div>
    <div class="carousel-item row justify-content-center">
    <img src="${data.sprites.front_shiny}"   height="200px" style="max-height:200px; min-height:200px;">
    </div>
    <div class="carousel-item active  row justify-content-center">
    <img src="${data.sprites.other.showdown.front_default}"  height="200px" style="max-height:200px; min-height:200px;">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
<nav class="nav nav-pills nav-fill">
  <a class="nav-link active navChange" aria-current="page" href="#" id="infoCard" data-name="infoCard">Info</a>
  <a class="nav-link navChange" href="#" id="evolutionCard" data-name="evolutionCard">Evolution</a>
  <a class="nav-link navChange" href="#" id="movesCard" data-name="movesCard">Moves</a>
</nav>

        <div class="w-100 col-12 col-xl-3 col-md-3 col-sm-3 col-lg-3 row align-items-center justify-content-center">
           
            <div class="text-white">
                ${statsHtml}
            </div>
            
        </div>
    `);
  }, "json");

});


$(document).on('click', '.navChange', function () {
  $('.navChange').removeClass('active')
  switch ($(this).attr('data-name')) {
    case "infoCard": $('#infoCard').addClass('active');
      break;
    case "evolutionCard": $('#evolutionCard').addClass('active');
      break;
    case "movesCard": $('#movesCard').addClass('active');
      break;
  }
})

function GetNameStat(nameStat){
  let statName = ""
  switch (nameStat) {
    case 'hp': statName = "HP";
      break;
    case 'attack': statName = "ATK";
      break;
    case 'defense': statName = "DEF";
      break;
    case 'special-attack': statName = "SATK";
      break;
    case 'special-defense': statName = "SDEF";
      break;
    case 'speed': statName = "SPD";
      break;
  }
  return statName;
}

