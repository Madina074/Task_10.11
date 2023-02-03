// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // поле для ввода минимального веса
const maxWeightInput = document.querySelector('.maxweight__input'); // поле для ввода максимального веса
let minWeight;
let maxWeight;

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML="";

  for(let i = 0; i < fruits.length; i++){
    const $div = document.createElement('li')
    $div.innerHTML = `Фрукт №${i+1}`+ `<br>` + fruits[i].kind +`<br>`+ fruits[i].color +`<br>`+ `Вес: ${fruits[i].weight}кг`;
    function colorB(color, typeColor){
        if(fruits[i].color == color) {
          $div.className = typeColor;
        }
      }
      colorB("фиолетовый", "fruit__item fruit_violet");
      colorB("зеленый", "fruit__item fruit_green");
      colorB("розово-красный", "fruit__item fruit_carmazin");
      colorB("желтый", "fruit__item fruit_yellow");
      colorB("светло-коричневый", "fruit__item fruit_lightbrown");    
      fruitsList.appendChild($div);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  const  fruits_old  = [...fruits];

  while (fruits.length > 0) {
    let d = getRandomInt(0, fruits.length-1);
    result.push(fruits[d]);
    fruits.splice(d,1);
  }

  fruits = result;
  const notMixed = fruits.every((element, index) => element == fruits_old[index]);
  if (notMixed){
    alert ('Порядок не изменился')
  }
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  return fruits.filter((item) => {
    return (item.weight >= minWeight) && (item.weight <= maxWeight)
  });
};

filterButton.addEventListener('click', () => {
  minWeight = parseInt(minWeightInput.value); 
  maxWeight = parseInt(maxWeightInput.value); 
  if ((minWeightInput.value != "") && (maxWeightInput.value !="")) {
  fruits = filterFruits();
  display();
}else {
    alert ('Пожалуйста заполните поля min и max weight')
  };
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priorityColor = {
    "фиолетовый": 0,
    "зеленый": 1,
    "розово-красный": 2,
    "желтый": 3,
    "светло-коричневый": 4
  };
  return priorityColor[a.color] > priorityColor[b.color];
};

function swap(items, firstIndex, secondIndex){
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}

const sortAPI = {
  bubbleSort(arr, comparation) {
    const a = arr.length;
    for (let i = 0; i < a-1; i++){
      for (let j = 0; j < a-1-i; j++){
        if (comparation(arr[j], arr[j+1])){
          let temp = arr[j+1]; 
          arr[j+1] = arr[j]; 
          arr[j] = temp; 
        }
      }
    }
  },
  
  quickSort(items, left, right) {
    quickSort1(items, left, right);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation, left, right) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if(sortKind == 'bubbleSort'){
    sortKind = 'quickSort';
  }else {
    sortKind = 'bubbleSort';
  };
  sortKindLabel.textContent = sortKind;
  sortTime = '-';
  sortTimeLabel.textContent = sortTime;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  let weightInputNumber = parseFloat(weightInput.value);
  let result = {"kind": kindInput.value, "color": colorInput.value, "weight": weightInputNumber};
  if((kindInput.value == "") || (colorInput.value == "") || (weightInput.value == "")){
    alert("Введены не все данные!");
  }else if((isNaN(weightInputNumber))){
    alert("Укажите вес числом.");
  }else {
    fruits.push(result);  
  };
  display();
});

function quickSort1(arr, left, right){
    function swap(arr, firstIndex, secondIndex){
       const temp = arr[firstIndex];
       arr[firstIndex] = arr[secondIndex];
       arr[secondIndex] = temp;
    };
 
    function partition(items, left, right) {
      var pivot = items[Math.floor((right + left) / 2)],
          i = left,
          j = right;
      while (i <= j) {
          while (items[i] < pivot) {
              i++;
          }
          while (items[j] > pivot) {
              j--;
          }
          if (i <= j) {
              swap(items, i, j);
              i++;
              j--;
          }
      }
      return i;
   }
 
    var index;
    if (arr.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? arr.length - 1 : right;
        index = partition(arr, left, right);
        if (left < index - 1) {
          quickSort1(arr, left, index - 1);
        }
        if (index < right) {
          quickSort1(arr, index, right);
        }
    }
       return arr;
};