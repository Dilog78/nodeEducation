/****************************************************************
Описание
  Вам дается квадратная сетка с обычными . и заблокированными X ячейками. 
  Ваша игровая фигура может перемещаться по любой строке или столбцу или диагонали, пока не достигнет края сетки или заблокированной ячейки. 
  Учитывая сетку, начальную и конечную позиции, постройте кратчайший путь, чтобы добраться до конечной позиции.

Например
  Дана сетка:
  .X.
  .X.
  ...

  Система координаты для данной сетки:
  0.0 0.1 0.2
  1.0 1.1  1.2
  2.0  2.1  2.2

  Начальна позиция 2.1 (отсчет идет с верхнего левого края сетки 0.0)
  Конечная позиция 0.2

  Путь движения между начальной и конечной точкой: (2.1) -> (1.2) -> (0.2)
  Ответ: [{x:2, y:1}, {x:1, y:2}, {x:0, y:2}]

  Задача
    Завершите выполнение функции в редакторе. Функция должена вывести массив объектов координат которые обеспечивают минимальное количество шагов для перехода от начальной позиции к конечной и порядок массива соответвует движения по координатам.

  Ограничения
    Длина сетки > 1 и < 100
    Координата начальной и конечной точки входит в предоставленную сетку.
    Задача должна быть решена с использованием ООП
    
****************************************************************/

function runner(gridList, startX, startY, endX, endY) {
    // TODO

    const grid = [];

    gridList.forEach(elem => {
        const arr = elem.split('');
        grid.push(arr);
    });

    return grid;
}

const result = runner(
  [
    '.X.',
    '.X.',
    '...',
  ], 
  2, 1,
  0, 2
);

console.log(result);