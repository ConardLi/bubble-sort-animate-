/**
*    李世奇  2018.7.16
**/

(function (global, undefined) {


    /**
     * 构造函数
     * @param {构造参数} opt 
     */
    function MySort(opt) {

        //参数赋值
        this.def = opt;
        //初始化dom
        this._initDom();

    }


    /**
     * 初始化dom(计算排序item的宽高，自适应容器)
     */
    MySort.prototype._initDom = function () {

        //获取容器
        let container = document.getElementById(this.def.container);
        //获取数据
        let arr = this.def.arr;
        //获取数组最大值
        let max = Math.max.apply(null, arr);
        //容器宽度
        let cWidth = container.offsetWidth;
        //容器高度
        let cHeight = container.offsetHeight - 50;
        //计算item宽度
        let count = arr.length;
        let itemWidth = (cWidth - this.def.sep * (count + 1)) / count;
        //填充dom
        let html = '';
        arr.forEach((element, index) => {

            //计算left
            let left = index * itemWidth + (index + 1) * this.def.sep;
            //计算高度
            let height = element / max * cHeight;

            html += `<div class="item normalItem" style="left:${left}px; width:${itemWidth}px; height:${height}px;">${element}</div>`;

        });
        container.innerHTML = html;

    }


    /**
     * 交换两个item的dom位置
     * @param {左侧item} tempItem1 
     * @param {右侧item} tempItem2 
     */
    MySort.prototype._changePosition = function (tempItem1, tempItem2) {

        tempItem1.parentNode.removeChild(tempItem2);
        tempItem1.parentNode.insertBefore(tempItem2, tempItem1);

    }


    /**
     * 交换两个item的逻辑位置实现动画
     * @param {排序数组} resArr 
     * @param {item列表} itemList 
     * @param {内侧循环index} j 
     */
    MySort.prototype._changeItem = function (resArr, itemList, j) {

        [resArr[j], resArr[j + 1]] = [resArr[j + 1], resArr[j]];
        let tempLeft = itemList[j].style.left;
        itemList[j].style.left = itemList[j + 1].style.left;
        itemList[j + 1].style.left = tempLeft;

    }


    /**
     * 给当前活跃的item添加样式
     * @param {item列表} itemList 
     * @param {内侧循环index} j 
     */
    MySort.prototype._activeItem = function (itemList, j) {

        itemList[j].classList.add('activeItem');
        itemList[j + 1].classList.add('activeItem');
        if (j > 0) {
            itemList[j - 1].classList.remove('activeItem');
        }

    }


    /**
     * 给已完成排序的item添加样式
     * @param {item列表} itemList 
     * @param {外侧循环index} i 
     * @param {内侧循环index} j 
     * @param {完成标示} complete 
     */
    MySort.prototype._completeItem = function (itemList, i, j, complete) {

        itemList[j + 1].classList.add('completeItem');
        itemList[j].classList.remove('activeItem');
        //如果完成把剩余item设置为complete
        if (complete) {
            for (j = 0; j < itemList.length - i - 1; j++) {
                itemList[j].classList.add('completeItem');
            }
        }

    }

    /**
     * 排序内部逻辑操作
     */
    MySort.prototype._render = async function (itemList,resArr,i,j, complete) {

        this._activeItem(itemList, j);
        await sleep(this.def.speed);

        if (resArr[j + 1] < resArr[j]) {

            this._changeItem(resArr, itemList, j);
            await sleep(this.def.speed);
            this._changePosition(itemList[j], itemList[j + 1]);
            complete = false;

        }

        //最后一次比较
        if (j == resArr.length - i - 2) {
            this._completeItem(itemList, i, j, complete);
        }

        //回调
        this.def.getData(resArr);
        return complete;

    }


    /**
     * 开始动画
     */
    MySort.prototype.start = async function () {

        let resArr = this.def.arr.slice();
        let len = resArr.length;
        let complete;
        let itemList = document.getElementById(this.def.container).childNodes;

        for (let i = 0; i < len - 1; i++) {
            complete = true;
            for (let j = 0; j < len - i - 1; j++) {
                //交换逻辑操作
               complete = await this._render(itemList,resArr,i,j,complete);
            }
            if (complete) {
                break;
            }
        }

    }


    /**
     * 线程睡眠
     * @param {睡眠时间} time 
     */
    var sleep = function (time) {

        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })

    };


    global.MySort = MySort;


})(window);