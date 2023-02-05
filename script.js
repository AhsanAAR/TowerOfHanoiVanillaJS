var steps;
var moves;
var undone_moves;
var plates;
var plate_template;
var timer_interval;

function increase_plates()
{
  if(plates < 9){
    plates++;
    document.getElementById("plates_number").innerText = plates;
  }
}

function decrease_plates()
{
  if(plates > 3){
    plates--;
    document.getElementById("plates_number").innerText = plates;
  }
}

function start_game(){
  populate_danda();
  document.getElementById("restart_btn").removeAttribute("disabled");
  document.getElementById("start_btn").setAttribute("disabled", "true");

  document.getElementById("increase_plates_btn").setAttribute("disabled", "true");
  document.getElementById("decrease_plates_btn").setAttribute("disabled", "true");

  document.getElementById("undo_btn").removeAttribute("disabled");
  document.getElementById("redo_btn").removeAttribute("disabled");

  var fiveMinutes = 2*60;
  display = document.querySelector('#time');
  startTimer(fiveMinutes, display);
}

function restart_game(){
  initialize();
  document.getElementById("restart_btn").setAttribute("disabled", "true");
  document.getElementById("undo_btn").setAttribute("disabled", "true");
  document.getElementById("redo_btn").setAttribute("disabled", "true");

  document.getElementById("start_btn").removeAttribute("disabled");
  document.getElementById("increase_plates_btn").removeAttribute("disabled");
  document.getElementById("decrease_plates_btn").removeAttribute("disabled");
  
  clearInterval(timer_interval);
}

function initialize() {
  steps = 0;
  moves = [];
  undone_moves = [];
  plates = 5;

  document.getElementById("increase_plates_btn").removeAttribute("disabled");
  document.getElementById("decrease_plates_btn").removeAttribute("disabled");

  danda = document.getElementById("danda1").innerHTML = "";
  danda = document.getElementById("danda2").innerHTML = "";
  danda = document.getElementById("danda3").innerHTML = "";

  document.getElementById("step_counter").innerText = steps;
  document.getElementById("plates_number").innerText = plates;
  plate_template = document.createElement("div");
  plate_template.setAttribute("class", "plate");
  plate_template.setAttribute("ondrop", "return false;");
  plate_template.setAttribute("draggable", "true");

  document.querySelector('#time').textContent = "02:00";
}

function populate_danda(){
  danda = document.getElementById("danda1")
  danda.innerHTML = "";
  for(let i = plates; i > 0; i--){
    plate_copy = plate_template;
    plate_copy.setAttribute("id", i);
    plate_copy.innerText = i;
    console.log(plate_copy);
    danda.appendChild(plate_copy.cloneNode(true));
  }
}

function increment_steps() {
  steps++;
  document.getElementById("step_counter").innerText = steps;
}

function decrement_steps() {
  steps--;
  document.getElementById("step_counter").innerText = steps;
}

function store_move(array, from, to){
  array.push(from, to);
}

function redo(){
  if (undone_moves.length > 0){
    increment_steps();
    let from = undone_moves.pop();
    let to = undone_moves.pop()
    store_move(moves, from, to);
    let gameboard = Array.from(document.getElementById("gameboard").children);
    from_tower = gameboard[from];
    to_tower = gameboard[to];
    to_tower.firstElementChild.firstElementChild.appendChild(from_tower.firstElementChild.firstElementChild.lastElementChild)
  }
}


function undo(){
  if (moves.length > 0){
    decrement_steps();
    let from = moves.pop();
    let to = moves.pop()
    store_move(undone_moves, from, to);
    let gameboard = Array.from(document.getElementById("gameboard").children);
    from_tower = gameboard[from];
    to_tower = gameboard[to];
    to_tower.firstElementChild.firstElementChild.appendChild(from_tower.firstElementChild.firstElementChild.lastElementChild)
  }
}

function startdrag(event) {
  let plate = event.target;
  let index = Array.from(plate.parentNode.children).indexOf(plate);
  if (index == plate.parentNode.children.length - 1) {
    event.dataTransfer.setData("text", plate.id);
    // console.log("transferring");
    // console.log(plate.id);
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop_container(ev){
  var plate_id = ev.dataTransfer.getData("text");
  var danda = ev.target.children[0];

  if (
    danda.children.length == 0 ||
    plate_id < danda.children[danda.children.length - 1].id
  ) {
    let plate = document.getElementById(plate_id);
    let tower_from = plate.parentNode.parentNode.parentNode;
    let tower_to = danda.parentNode.parentNode;
    let index_from = Array.from(document.getElementById("gameboard").children).indexOf(tower_from);
    let index_to = Array.from(document.getElementById("gameboard").children).indexOf(tower_to);

    store_move(moves, index_from, index_to);
    undone_moves = [];
    danda.appendChild(plate);
    increment_steps();
  }
}

function drop_danda(ev){
  var plate_id = ev.dataTransfer.getData("text");
  var danda = ev.target;

  if (
    danda.children.length == 0 ||
    plate_id < danda.children[danda.children.length - 1].id
  ) {
    let plate = document.getElementById(plate_id);
    let tower_from = plate.parentNode.parentNode.parentNode;
    let tower_to = danda.parentNode.parentNode;
    let index_from = Array.from(document.getElementById("gameboard").children).indexOf(tower_from);
    let index_to = Array.from(document.getElementById("gameboard").children).indexOf(tower_to);

    store_move(moves, index_from, index_to);
    undone_moves = [];
    danda.appendChild(plate);
    increment_steps();
  }
}

function drop(ev) {
  if (ev.target.className == "danda-container"){
    drop_container(ev);
  }else if(ev.target.className == "danda"){
    drop_danda(ev);
  }
}

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  timer_interval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          alert("you lost. time is up");
          restart_game();
      }
  }, 1000);
}
