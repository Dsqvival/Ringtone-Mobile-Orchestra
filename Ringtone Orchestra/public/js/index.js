var start, jumpToDecode, lastTime, lastAcc, isStarted = false;
var id = -1;


start = function() {
    $('.silence').hide();
    $('.sprite').show();
    $('.ctrl_fav').show();
    
    $.get('/startplay', function(_id) {
      console.log('hiiii there', _id);
      id = _id; 
    });

    GestureTest();
    GestureTest();
    GestureTest();
    //GestureTest();
    //GestureTest();
    //GestureTest();
};

end = function() {
    $('.silence').show();
    $('.sprite').hide();
    $('.ctrl_fav').hide();

    $.get('/endplay', function(_id) {
      console.log('hiiii there', _id);
      id = _id; 
    });
}

effect = function() {
    $.get('/effects', function(_id) {
      console.log('hi there', _id);
      id = _id; 
    });
}

jumpToDecode = function() {
  window.location = '/';
};

window.onload = function() {
    $('.sprite').hide();
    $('.ctrl_fav').hide();
    $('.silence').on('click', start);
    $('.sprite').on('click', end);
    $('.ctrl_fav').on('click', effect);
};
﻿
function SendData(gestureIndex) {
    switch (gestureIndex) {
        case 2:
          $.get('/volumeUp', function(_id) {
            console.log('hi 2 there', _id);
            id = _id; 
          });
          break;
        case 3:
          $.get('/volumeDown', function(_id) {
            console.log('hi 3 there', _id);
            id = _id; 
          });
          break;
        case 4:
          $.get('/tuneUp', function(_id) {
            console.log('hi 4 there', _id);
            id = _id; 
          });
          break;
        case 5:
          $.get('/beatUp', function(_id) {
            console.log('hi 5 there', _id);
            id = _id; 
          });
          break;
        case 6:
          $.get('/tuneDown', function(_id) {
            console.log('hi 6 there', _id);
            id = _id; 
          });
          break;
        case 7:
          $.get('/beatDown', function(_id) {
            console.log('hi 5 there', _id);
            id = _id; 
          });
          break;
    }
}

/* GustureTest 为被调用函数
 * 返回值：0 表示 该用户无加速度传感器或三轴陀螺仪
 *         1 表示 该用户无方向传感器
 *         2 表示 转一转 (快速)
 *         3 表示 转一转 (慢速)
 *         4 表示 摇一摇 (快速)(水平)
 *         5 表示 摇一摇 (快速)(竖直)
 *         6 表示 摇一摇 (慢速)(水平)
 *         7 表示 摇一摇 (慢速)(竖直)*/

/*写给袋鼠： 所有的函数都封装在了第一个主函数中：GestureTest() 而问题出在这个函数的那个最后一句 我有详细的注释
 解决办法： 在我的函数GuestureDetect()中我标记的地方执行你的接下来的代码，这样就没有问题。如果不明白的话你再找我*/


var successCode = 666;

var SPACE = 60; //间隔 60ms
var maxPoints = 200; //最多1000个点
var beginPoints = 10;   //至少第5个点开始检测
var rangePoints = 50;  //检测范围50个点
//var waveNum = 5;    //至少有5次特征波形
var oriwaveNum = 3;
var accwaveNum = 4;
var speedRate = 4   //速度系数
var smoothRate = 4;     //平滑系数为4
var gestureIndex = -1;   //手势编号
var gesture = ["敲一敲(快速)", "敲一敲(慢速)", "转一转(快速)", "转一转(慢速)", "摇一摇(快速)(水平)", "摇一摇(快速)(竖直)", "摇一摇(慢速)(水平)", "摇一摇(慢速)(竖直)"];

var accdata_X = new Array();
var accpeak_X = new Array();
var acctemp_X, accmax_X = 25, accmin_X = 5, accthreshold_X = 20;

var rotdata_X = new Array();
var rotpeak_X = new Array();
var rottemp_X, rotmax_X = 20000, rotmin_X = -20000, rotthreshold_X = 40000;

var rotdata_Y = new Array();
var rotpeak_Y = new Array();
var rottemp_Y; rotmax_Y = 40000, rotmin_Y = -40000, rotthreshold_Y = 50000;

var rotdata_Z = new Array();
var rotpeak_Z = new Array();
var rottemp_Z; rotmax_Z = 15000, rotmin_Z = -15000, rotthreshold_Z = 20000;

var oridata_X = new Array();
var oritemp_X, orithreshold_X = 130;

var oridata_Y = new Array();
var oritemp_Y, orithresholdDown_Y = 50, orithresholdUp_Y = 130;

var Index = 0;
var NewThread;
var debugmes;

function initializeGesture() {
    beginPoints = 10;   //至少第5个点开始检测
    rangePoints = 50;  //检测范围50个点
    oriwaveNum = 3;
    accwaveNum = 4;
    speedRate = 4   //速度系数
    smoothRate = 4;     //平滑系数为4
    gestureIndex = -1;   //手势编号

    accdata_X = [];
    accpeak_X = [];
    acctemp_X; accmax_X = 25; accmin_X = 5; accthreshold_X = 20;

    rotdata_X = [];
    rotpeak_X = [];
    rottemp_X; rotmax_X = 20000; rotmin_X = -20000; rotthreshold_X = 40000;

    rotdata_Y = [];
    rotpeak_Y = [];
    rottemp_Y; rotmax_Y = 40000; rotmin_Y = -40000; rotthreshold_Y = 50000;

    rotdata_Z = [];
    rotpeak_Z = [];
    rottemp_Z; rotmax_Z = 15000; rotmin_Z = -15000; rotthreshold_Z = 20000;

    oridata_X = [];
    oritemp_X; orithreshold_X = 130;

    oridata_Y = [];
    oritemp_Y; orithresholdDown_Y = 50; orithresholdUp_Y = 130;

    Index = 0;

}
//定义好各个变量
//先启动每个传感器 注册传感器时间
//在主程序中setTimer来读取传感器数据
//判断 如果成功 然后调用收尾函数 返回
function GestureTest() {
    var StateCode = StartSensor();
    if (StateCode != successCode) {
        alert("出错了呜呜呜(您的手机没有可识别传感器设备)");
    }
    for (var i = 0; i < 200; ++i) {
        accpeak_X[i] = 0;
        rotpeak_X[i] = 0;
        rotpeak_Y[i] = 0;
        rotpeak_Z[i] = 0;
    }
    
    /**************************就是这个函数：setInterval********************************************/
    NewThread = self.setInterval("UpdateSensor();GuestureDetect()", 40);
    /***********************************************************************************************/
    //比如这里有个alert("hahahahha");那么上面的语句一旦执行完，将事件注册后就会执行本条alert语句和下条return语句，而此时可能还没有得到那个gestureIndex
    //这就意味着逻辑流会提早穿越。不知道你是否能理解
    //return gestureIndex; // 于是这时候gestureIndex仍然是undefined，还未被赋值。
}

function StartSensor() {
    // 注册动作传感器监听器
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", motionHandler, false);
    } else {
        return 0;
    }
    // 注册方向传感器监听器
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", orientationHandler, false);
    } else {
        //取消动作传感器监听
        window.removeEventListener("devicemotion", motionHandler, false);
        return 1;
    }
    // 都注册成功 返回
    return successCode;
}

function orientationHandler(event) {
    
    oritemp_X = - event.beta + 180;
    oritemp_Y = - event.gamma + 90;
}

function motionHandler(event) {
    
    acctemp_X = event.accelerationIncludingGravity.x + 20;
    rottemp_X = 50 * event.rotationRate.alpha + 250;
    rottemp_Y = 50 * event.rotationRate.beta + 250;
    rottemp_Z = 50 * event.rotationRate.gamma + 250;
}

function StopSensor() {
    //取消动作/方向传感器监听
    window.removeEventListener("deviceMotion", motionHandler, false);
    window.removeEventListener("deviceOrientation", orientationHandler, false);
    //取消计时器
    clearInterval(NewThread);
}

function UpdateSensor() {
    
    if (Index < maxPoints) {
        Index++;
        accdata_X[Index] = acctemp_X - Math.random() / 1000;
        if (acctemp_X > accmax_X)
            accmax_X = acctemp_X;
        if (acctemp_X < accmin_X)
            accmin_X = acctemp_X;
        accthreshold_X = (accmax_X - accmin_X) / 2;
        
        
        rotdata_X[Index] = rottemp_X - Math.random();
        if (rottemp_X > rotmax_X)
            rotmax_X = rottemp_X;
        if (rottemp_X < rotmin_X)
            rotmin_X = rottemp_X;
        rotthreshold_X = (rotmax_X - rotmin_X) / 2;
        
        rotdata_Y[Index] = rottemp_Y - Math.random();
        if (rottemp_Y > rotmax_Y)
            rotmax_Y = rottemp_Y;
        if (rottemp_Y < rotmin_Y)
            rotmin_Y = rottemp_Y;
        rotthreshold_Y = (rotmax_Y - rotmin_Y) / 2;
        
        rotdata_Z[Index] = rottemp_Z - Math.random();
        if (rottemp_Z > rotmax_Z)
            rotmax_Z = rottemp_Z;
        if (rottemp_Z < rotmin_Z)
            rotmin_Z = rottemp_Z;
        rotthreshold_Z = (rotmax_Z - rotmin_Z) / 2;
        
        oridata_X[Index] = oritemp_X - Math.random();
        oridata_Y[Index] = oritemp_Y - Math.random();
        
        
    }
    else {
        Index = 0;
        for (var i = 0; i < 200; ++i) {
            accpeak_X[i] = 0;
            rotpeak_X[i] = 0;
            rotpeak_Y[i] = 0;
            rotpeak_Z[i] = 0;
        }
    }
}

function GuestureDetect() {
    
    if (peakDetect(rotdata_X, rotpeak_X, Index, (rotthreshold_X / smoothRate)) + peakDetect(rotdata_Y, rotpeak_Y, Index, (rotthreshold_Y / smoothRate)) != 0) { //一旦侦测到波峰，触发判断条件
        //trigger 阶段 判断x轴角速度条件
        //confirm 阶段 判断Y轴角速度条件
        if (peakJudement(rotdata_X, rotpeak_X, Index, rotthreshold_X, oriwaveNum) || (peakJudement(rotdata_Y, rotpeak_Y, Index, rotthreshold_Y, oriwaveNum))) {
            gestureIndex = 2;
            if (speedJudement(rotdata_X, rotpeak_X, Index, rotthreshold_X, speedRate + 1, oriwaveNum) || (speedJudement(rotdata_Y, rotpeak_Y, Index, rotthreshold_Y, speedRate + 1, oriwaveNum)))
                gestureIndex = 2;
            else
                gestureIndex = 3;
        }
    }
    
    if (peakDetect(accdata_X, accpeak_X, Index, (accthreshold_X / smoothRate)) + peakDetect(rotdata_Z, rotpeak_Z, Index, (rotthreshold_Z / smoothRate)) != 0) {   //一旦侦测到波峰，触发判断条件
        // trigger 阶段 判断x轴加速度条件
        //confirm 阶段 判断z轴角速度条件
        if (peakJudement(accdata_X, accpeak_X, Index, accthreshold_X, accwaveNum) && (peakJudement(rotdata_Z, rotpeak_Z, Index, rotthreshold_Z, accwaveNum))) {
            gestureIndex = 4;
            if (speedJudement(accdata_X, accpeak_X, Index, accthreshold_X, speedRate, accwaveNum) || (speedJudement(rotdata_Z, rotpeak_Z, Index, rotthreshold_Z, speedRate, accwaveNum)))
                gestureIndex = 4;
            else
                gestureIndex = 6;
            if (orientationJudementDown(oridata_X, accpeak_X, Index, orithreshold_X) || orientationJudementDown(oridata_Y, accpeak_X, Index, orithresholdDown_Y) || orientationJudementUp(oridata_Y, accpeak_X, Index, orithresholdUp_Y))
                gestureIndex++;
        }
    }
    if (gestureIndex != -1) {
        SendData(gestureIndex);
        //alert(gesture[gestureIndex]);
        StopSensor();
        initializeGesture();
    }
}

function peakDetect(a, p, index, threshold) {
    if (index < beginPoints + 1)
        return 0;
    var preIndex, pppIndex;
    var tmpGrad;
    if ((a[index - 1] >= a[index - 2] && a[index - 1] >= a[index]) || (a[index - 1] <= a[index - 2] && a[index - 1] <= a[index])) {
        preIndex = p[index - 1];
        pppIndex = p[preIndex];
        if (preIndex < beginPoints + 1) {   //如果在冷启点之前，不考虑平滑
            p[index] = index - 1;
            return 0;
        }
        tmpGrad = a[index - 1] - a[preIndex];
        tmpGrad = tmpGrad > 0 ? tmpGrad : -tmpGrad;
        if (tmpGrad < threshold) {    //波谷波峰间小于阈值,平滑之
            for (var i = preIndex; i <= index; ++i)
                p[i] = pppIndex;
            p[index] = pppIndex;
            p[index - 1] = pppIndex;
        }
        else {   //波峰波谷间大于阈值 保留其为波谷/波峰
            p[index] = index - 1;
            return 1;
        }
    } else {    //既非波峰 也非波谷
        p[index] = p[index - 1];
    }
    return 0;
}

function peakJudement(a, p, index, thresholdGrad, waveNum) {
    var Counter = 0;
    for (var preIndex = index - 1, pppreIndex = p[preIndex]; preIndex > index - rangePoints; preIndex = pppreIndex, pppreIndex = p[pppreIndex]) {
        if (pppreIndex < beginPoints || preIndex < beginPoints)
            break;
        if (preIndex - pppreIndex > rangePoints / 4)
            return false;
        var tempGrad = a[preIndex] - a[pppreIndex];
        tempGrad = tempGrad > 0 ? tempGrad : -tempGrad;
        if (tempGrad > thresholdGrad)
            Counter++;
        if (Counter == waveNum)
            return true;
    }
    return false;
}

function speedJudement(a, p, index, thresholdGrad, Speedrate, waveNum) {
    var Counter = 0;
    for (var preIndex = index - 1, pppreIndex = p[preIndex]; preIndex > index - rangePoints; preIndex = pppreIndex, pppreIndex = p[pppreIndex]) {
        if (pppreIndex < beginPoints || preIndex < beginPoints)
            break;
        var tempGrad = a[preIndex] - a[pppreIndex];
        tempGrad = tempGrad > 0 ? tempGrad : -tempGrad;
        if (tempGrad > thresholdGrad)
            Counter++;
        if (Counter == waveNum && index - preIndex < rangePoints / Speedrate)
            return true;
    }
    return false;
}

function orientationJudementDown(a, p, index, thresholdAngle) {
    var Counter = 0;
    for (var preIndex = index - 1, pppreIndex = p[preIndex]; preIndex > index - rangePoints; preIndex = pppreIndex, pppreIndex = p[pppreIndex]) {
        Counter++;
        if (pppreIndex < beginPoints || preIndex < beginPoints)
            break;
        if (Counter == oriwaveNum)
            break;
        for (var i = -1; i < 3; ++i)
            if (a[preIndex + i] < thresholdAngle && a[preIndex + i] != 0)
                return true;
    }
    return false;
}

function orientationJudementUp(a, p, index, thresholdAngle) {
    var Counter = 0;
    for (var preIndex = index - 1, pppreIndex = p[preIndex]; preIndex > index - rangePoints; preIndex = pppreIndex, pppreIndex = p[pppreIndex]) {
        Counter++;
        if (pppreIndex < beginPoints || preIndex < beginPoints)
            break;
        if (Counter == oriwaveNum)
            break;
        for (var i = -1; i < 3; ++i)
            if (a[preIndex + i] > thresholdAngle)
                return true;
    }
    return false;
}