/**
*    李世奇  2018.7.16o
**/
(function (global, undefined) {

    function mySort(opt) {
        this.def = opt;
        this.def.containerId = 'sortUl' + new Date().getTime();
        this.def.start = false;
        this.def.data = [];
        this._initData();
        this._initHtml(this.def.data);
    }

    mySort.prototype = {
        constructor: this,
        _initData:function(arr){
            //初始化数据
            var html = ` <div class="sortUl" id="${this.def.containerId}"></div>`
            document.getElementById(this.def.container).innerHTML = html;
            this.def.arr.forEach(element => {
                this.def.data.push({value:element,isComplete:false});
            });
        },
        _initHtml: function (arr) {
            //初始化html结构和事件监听

            //容器
            var container = document.getElementById(this.def.containerId);
            //数组最大值
            var max = this._getMax(arr);
            //容器宽度
            var cWidth = container.offsetWidth;
            //容器高度
            var cHeight = container.offsetHeight - 50;
            //item宽度
            var count = arr.length;
            var itemWidth = (cWidth - this.def.sep * (count + 1)) / count;

            html = '';
            arr.forEach((element, index) => {
                var id = 'item_' + element.value + "_" + new Date().getTime();
                if(!element.isComplete){
                    html += `<div id="${id}" class="item normalItem" style="left:${index * itemWidth + (index + 1) * this.def.sep}px; width:${itemWidth}px; height:${element.value / max * cHeight}px;">${element.value}</div>`
                }else{
                    html += `<div id="${id}" class="item completeItem" style="left:${index * itemWidth + (index + 1) * this.def.sep}px; width:${itemWidth}px; height:${element.value / max * cHeight}px;">${element.value}</div>`
                }
            
            });
            container.innerHTML = html;
        },
        _getMax: function (arr) {
            var max = arr[0].value;
            arr.forEach(element => {
                if (element.value > max) {
                    max = element.value;
                }
            });
            return max;
        },
        start: async function () {
            if (!this.def.start) {
                this.def.start = true;
                var resArr = this.def.data.slice();
                var len = resArr.length, j;
                var temp, complete, tempItem1, tempItem2;
                var itemList = document.getElementById(this.def.containerId).childNodes;
                for (let i = 0; i < len - 1; i++) {
                    complete = true;
                    for (j = 0; j < len - i - 1 ; j++) {
                        temp = resArr[j].value;
                        tempItem1 = itemList[j];
                        tempItem2 = itemList[j + 1];
                        tempItem1.classList.add('activeItem');
                        tempItem2.classList.add('activeItem');
                        await sleep(this.def.speed);
                        if (resArr[j + 1].value < resArr[j].value) {
                            temp = resArr[j];
                            resArr[j] = resArr[j + 1];
                            resArr[j + 1] = temp;
                            complete = false;

                            var tempLeft = tempItem1.style.left;
                            tempItem1.style.left = tempItem2.style.left;
                            tempItem2.style.left = tempLeft;
                            await sleep(this.def.speed);
                        }
                        if(j == len - i - 2){
                            resArr[j + 1].isComplete = true;
                        }
                        this._initHtml(resArr);
                        var a = getData(resArr);
                        this.def.getData(a);
                    }
                    if (complete == true) {
                        this.def.start = false;
                        break;
                    }
                }
                
                return resArr;
            }
        }
    }

    var getData = function(array){
            //获取排序后的数组
           var arr = []
           array.forEach(element => {
               arr.push(element.value);
           }); 
           return arr;
        }

    
    var sleep = function (time) {
        //暂停
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    global.mySort = mySort;

})(window);